#!/usr/bin/env bash
# Safe production update for Best Medical (run on the VPS as root):
#   cd /var/www/best-medical && bash scripts/deploy.sh
#
# 1. backs up DB + every uploaded file + .env
# 2. git pull (fast-forward only) — uploaded images are NOT in git, so pull never touches them
# 3. verifies the number of image files did not go down (otherwise restores + aborts)
# 4. npm ci → db:migrate → build → restart PM2 → health check
# 5. if anything fails after the pull, rolls the code back to the previous commit
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/var/www/best-medical}"
PM2_NAME="${PM2_NAME:-best-medical}"
BRANCH="${BRANCH:-master}"
PORT="${PORT:-3000}"
cd "$APP_DIR"

TS=$(date +%Y%m%d_%H%M%S)
BK="/var/backups/deploy_$TS"
mkdir -p "$BK" && chmod 700 "$BK"
say() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31m✖ %s\033[0m\n' "$*"; exit 1; }

# every place user-uploaded files can live (old and new layout)
UPLOAD_DIRS=(public/pdimage public/categoryimg public/uploads public/contact public/payments storage/payments)
count_files() { local n=0 d; for d in "${UPLOAD_DIRS[@]}"; do [ -d "$d" ] && n=$((n + $(find "$d" -type f ! -name '.gitkeep' | wc -l))); done; echo "$n"; }

# --------------------------------------------------------------------------- 1
say "สำรองข้อมูลไปที่ $BK"
DB_NAME=$(grep -E '^DB_NAME=' .env | tail -1 | cut -d= -f2- | tr -d "\"' \r")
mysqldump --single-transaction --routines --events "${DB_NAME:-best_medical}" | gzip > "$BK/db.sql.gz"
EXISTING=(); for d in "${UPLOAD_DIRS[@]}"; do [ -d "$d" ] && EXISTING+=("$d"); done
tar czf "$BK/uploads.tar.gz" "${EXISTING[@]}"
cp .env "$BK/env"
chmod 600 "$BK"/*
BEFORE=$(count_files)
PREV=$(git rev-parse HEAD)
echo "$PREV" > "$BK/previous_commit"
echo "ไฟล์รูป/สลิปก่อนอัปเดต: $BEFORE ไฟล์ · commit เดิม: ${PREV:0:7}"

restore_files() {
  say "กู้คืนไฟล์รูปจาก backup"
  tar xzf "$BK/uploads.tar.gz" -C "$APP_DIR"
}
rollback() {
  say "ย้อนโค้ดกลับไป ${PREV:0:7}"
  git reset --hard "$PREV"
  restore_files
  npm ci --no-audit --no-fund && npm run build && pm2 restart "$PM2_NAME" --update-env || true
  die "อัปเดตไม่สำเร็จ — ย้อนกลับเวอร์ชันเดิมแล้ว (backup: $BK)"
}

# --------------------------------------------------------------------------- 2
say "git pull origin $BRANCH"
# .next used to be committed; drop local build artefacts so the pull is clean
git ls-files -m -- .next | xargs -r git checkout --
git pull --ff-only origin "$BRANCH"
echo "commit ใหม่: $(git rev-parse --short HEAD)"

# --------------------------------------------------------------------------- 3
AFTER=$(count_files)
echo "ไฟล์รูป/สลิปหลัง git pull: $AFTER ไฟล์"
if [ "$AFTER" -lt "$BEFORE" ]; then
  restore_files
  [ "$(count_files)" -ge "$BEFORE" ] || rollback
fi

trap rollback ERR

# --------------------------------------------------------------------------- 4
say "ติดตั้ง dependencies"
npm ci --no-audit --no-fund

say "อัปเดตฐานข้อมูล"
# new auth needs its own strong secret (generated once, never printed)
if ! grep -qE '^AUTH_SECRET=.{32,}' .env; then
  printf '\nAUTH_SECRET=%s\n' "$(openssl rand -base64 48 | tr -d '\n')" >> .env
  echo "• สร้าง AUTH_SECRET ใหม่ใน .env"
fi
grep -qE '^SITE_URL=' .env || printf 'SITE_URL=https://best-medical-bm.com\n' >> .env
chmod 600 .env
npm run db:migrate
AFTER=$(count_files)
[ "$AFTER" -ge "$BEFORE" ] || { echo "ไฟล์ลดลงหลัง migrate ($AFTER < $BEFORE)"; false; }

say "build (เว็บจะหยุดชั่วคราวประมาณ 2-3 นาที)"
pm2 stop "$PM2_NAME" >/dev/null || true
rm -rf .next
NODE_OPTIONS="--max-old-space-size=1536" npm run build

say "เริ่มเว็บใหม่"
pm2 restart "$PM2_NAME" --update-env
pm2 save >/dev/null

for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/api/product" || true)
  [ "$code" = "200" ] && break
  sleep 2
done
[ "$code" = "200" ] || { echo "health check failed ($code)"; false; }
for u in / /product /login; do
  c=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT$u")
  [ "$c" = "200" ] || { echo "$u -> $c"; false; }
done

trap - ERR
say "อัปเดตสำเร็จ ✔  ไฟล์รูป/สลิป: $(count_files) ไฟล์ (ก่อนหน้า $BEFORE) · backup: $BK"
