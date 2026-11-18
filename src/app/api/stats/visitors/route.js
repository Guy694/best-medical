import { query } from "@/app/lib/db";
import { json } from "@/app/lib/api";

let cache = { at: 0, data: null };

// GET /api/stats/visitors – public visitor counter (cached 60s)
export async function GET() {
  if (cache.data && Date.now() - cache.at < 60_000) return json(cache.data);
  try {
    const [row] = await query(
      `SELECT
         COUNT(DISTINCT CASE WHEN DATE(CONVERT_TZ(created_at,'+00:00','+07:00')) = DATE(CONVERT_TZ(UTC_TIMESTAMP(),'+00:00','+07:00')) THEN visitor_id END) AS today,
         COUNT(DISTINCT CASE WHEN created_at >= UTC_TIMESTAMP() - INTERVAL 5 MINUTE THEN session_id END) AS online,
         COUNT(DISTINCT session_id) AS total
       FROM analytics_events WHERE event = 'pageview'`
    );
    cache = {
      at: Date.now(),
      data: { today: Number(row.today) || 0, online: Number(row.online) || 0, total: Number(row.total) || 0 },
    };
  } catch {
    cache = { at: Date.now(), data: { today: 0, online: 0, total: 0 } };
  }
  return json(cache.data);
}
