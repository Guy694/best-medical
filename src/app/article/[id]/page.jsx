"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Copy, Eye, FileX2, Newspaper, Share2, Tag, UserRound } from "lucide-react";
import { useToast } from "@/app/components/Providers";
import { Alert, Breadcrumb, EmptyState } from "@/app/components/ui";
import { api, formatDate, imgSrc } from "@/app/lib/format";

function DetailSkeleton() {
  return (
    <div className="container-page max-w-4xl py-8">
      <div className="skeleton h-4 w-48" />
      <div className="skeleton mt-6 aspect-[21/9] w-full rounded-2xl" />
      <div className="skeleton mt-8 h-8 w-4/5" />
      <div className="skeleton mt-3 h-4 w-1/2" />
      <div className="mt-8 space-y-3">
        {[100, 95, 90, 100, 70].map((w, i) => (
          <div key={i} className="skeleton h-4" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

function RelatedCard({ a }) {
  return (
    <Link href={`/article/${a.id}`} className="group card flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc(a.banner)}
          alt={a.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-slate-500">{formatDate(a.published_at || a.created_at)}</p>
        <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900 group-hover:text-brand-700">{a.title}</h3>
      </div>
    </Link>
  );
}

export default function ArticleDetailPage() {
  const { id } = useParams();
  const toast = useToast();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [related, setRelated] = useState(null);
  const [copied, setCopied] = useState(false);
  const fetchedFor = useRef(null);

  useEffect(() => {
    // guard against React strict-mode double effects so the view counter only increments once
    if (!id || fetchedFor.current === id) return;
    fetchedFor.current = id;
    setArticle(null);
    setError(null);
    api(`/api/articles/${encodeURIComponent(id)}?view=1`)
      .then((d) => {
        if (!d?.article) throw Object.assign(new Error("ไม่พบบทความ"), { status: 404 });
        setArticle(d.article);
      })
      .catch((err) => setError({ status: err.status, message: err.message }));

    api("/api/articles?limit=4")
      .then((d) => setRelated((d?.articles || []).filter((a) => String(a.id) !== String(id)).slice(0, 3)))
      .catch(() => setRelated([]));
  }, [id]);

  useEffect(() => {
    if (article?.title) document.title = `${article.title} | Best Medical`;
    else if (error) document.title = "ไม่พบบทความ | Best Medical";
  }, [article, error]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("คัดลอกลิงก์แล้ว");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("ไม่สามารถคัดลอกลิงก์ได้");
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: article.title, url: window.location.href });
    } catch {}
  };

  if (error) {
    return (
      <div className="container-page py-12">
        <div className="card">
          {error.status === 404 ? (
            <EmptyState
              icon={FileX2}
              title="ไม่พบบทความ"
              description="บทความนี้อาจถูกลบหรือยังไม่เผยแพร่"
              action={
                <Link href="/article" className="btn btn-primary">
                  <ArrowLeft className="h-4 w-4" /> กลับไปหน้าบทความ
                </Link>
              }
            />
          ) : (
            <div className="card-body">
              <Alert tone="error" title="โหลดบทความไม่สำเร็จ">
                {error.message}
              </Alert>
              <Link href="/article" className="btn btn-secondary mt-4">
                <ArrowLeft className="h-4 w-4" /> กลับไปหน้าบทความ
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!article) return <DetailSkeleton />;

  const date = article.published_at || article.created_at;

  return (
    <article className="animate-fade-in">
      <div className="container-page max-w-4xl pt-6">
        <Breadcrumb items={[{ label: "หน้าแรก", href: "/" }, { label: "บทความ", href: "/article" }, { label: article.title }]} />
      </div>

      <header className="container-page max-w-4xl pt-6">
        {article.banner && (
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-slate-100 shadow-[var(--shadow-soft)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc(article.banner)}
              alt={article.title}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            />
          </div>
        )}
        <div className="mt-8">
          {article.category && (
            <Link href={`/article?category=${encodeURIComponent(article.category)}`} className="badge bg-accent-50 text-accent-700 ring-accent-600/20">
              <Tag className="h-3 w-3" /> {article.category}
            </Link>
          )}
          <h1 className="mt-3 text-2xl leading-tight font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">{article.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            {article.author_name && (
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-4 w-4" /> {article.author_name}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> {formatDate(date, { month: "long" })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" /> {Number(article.views || 0).toLocaleString("th-TH")} ครั้ง
            </span>
          </div>
        </div>
      </header>

      <div className="container-page max-w-4xl py-8">
        <div className="card card-body sm:p-10">
          {article.excerpt && <p className="mb-6 border-l-4 border-accent-400 pl-4 text-lg text-slate-600">{article.excerpt}</p>}
          <div className="prose-content" dangerouslySetInnerHTML={{ __html: article.content || "" }} />
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/article" className="btn btn-ghost">
            <ArrowLeft className="h-4 w-4" /> กลับไปหน้าบทความ
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">แชร์บทความ:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              Facebook
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              LINE
            </a>
            <button type="button" onClick={copyLink} className="btn btn-secondary btn-sm">
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              {copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
            </button>
            {typeof navigator !== "undefined" && navigator.share && (
              <button type="button" onClick={nativeShare} className="btn btn-secondary btn-sm btn-icon" aria-label="แชร์">
                <Share2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="border-t border-slate-200 bg-white py-10">
        <div className="container-page max-w-5xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="section-title flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-brand-700" /> บทความล่าสุด
            </h2>
            <Link href="/article" className="link inline-flex items-center gap-1 text-sm font-medium">
              ดูทั้งหมด <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {related === null ? (
            <div className="grid gap-6 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="skeleton aspect-[16/9] rounded-none" />
                  <div className="space-y-2 p-4">
                    <div className="skeleton h-3 w-1/3" />
                    <div className="skeleton h-4 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : related.length === 0 ? (
            <p className="text-sm text-slate-500">ยังไม่มีบทความอื่น</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((a) => (
                <RelatedCard key={a.id} a={a} />
              ))}
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
