"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
  Unlink,
} from "lucide-react";
import { useToast } from "@/app/components/Providers";
import { Spinner } from "@/app/components/ui";
import { api, cn } from "@/app/lib/format";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function ToolButton({ onClick, active, disabled, label, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        active ? "bg-brand-100 text-brand-800" : "hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden="true" />;

/**
 * Rich-text editor for articles.
 * Props: `content` (HTML), `onUpdate(html)`, `placeholder`.
 */
export default function TiptapEditor({ content, onUpdate, placeholder = "เริ่มเขียนเนื้อหาบทความ..." }) {
  const toast = useToast();
  const fileRef = useRef(null);
  const onUpdateRef = useRef(onUpdate);
  const [uploading, setUploading] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
      Placeholder.configure({ placeholder }),
    ],
    content: content || "",
    editorProps: {
      attributes: { class: "prose-content tiptap px-4 py-4 sm:px-5", "aria-label": "เนื้อหาบทความ" },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.isEmpty ? "" : ed.getHTML();
      onUpdateRef.current?.(html);
    },
  });

  // Sync when the parent swaps the content (e.g. opening another article).
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const next = content || "";
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (next !== current) editor.commands.setContent(next, { emitUpdate: false });
  }, [content, editor]);

  const state = useEditorState({
    editor,
    selector: ({ editor: ed }) =>
      ed
        ? {
            bold: ed.isActive("bold"),
            italic: ed.isActive("italic"),
            strike: ed.isActive("strike"),
            h2: ed.isActive("heading", { level: 2 }),
            h3: ed.isActive("heading", { level: 3 }),
            bullet: ed.isActive("bulletList"),
            ordered: ed.isActive("orderedList"),
            quote: ed.isActive("blockquote"),
            link: ed.isActive("link"),
            canUndo: ed.can().undo(),
            canRedo: ed.can().redo(),
          }
        : null,
  });

  const uploadImage = async (file) => {
    if (!file || !editor) return;
    if (!IMAGE_TYPES.includes(file.type)) return toast.error("รองรับเฉพาะไฟล์รูปภาพ JPG, PNG, WEBP หรือ GIF");
    if (file.size > 5 * 1024 * 1024) return toast.error("ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "articles");
      const res = await api("/api/upload", { method: "POST", body: fd });
      editor.chain().focus().setImage({ src: res.url, alt: file.name.replace(/\.[^.]+$/, "") }).run();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const openLink = () => {
    setLinkUrl(editor?.getAttributes("link").href || "");
    setLinkOpen(true);
  };
  const applyLink = () => {
    const url = linkUrl.trim();
    const chain = editor.chain().focus().extendMarkRange("link");
    if (!url) chain.unsetLink().run();
    else chain.setLink({ href: /^(https?:|mailto:|tel:|\/)/i.test(url) ? url : `https://${url}` }).run();
    setLinkOpen(false);
  };

  const s = state || {};
  const run = (fn) => () => editor && fn(editor.chain().focus()).run();

  return (
    <div className="rounded-xl border border-slate-300 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 rounded-t-xl border-b border-slate-200 bg-slate-50/95 px-2 py-1.5 backdrop-blur">
        <ToolButton label="ตัวหนา" active={s.bold} disabled={!editor} onClick={run((c) => c.toggleBold())}>
          <Bold className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="ตัวเอียง" active={s.italic} disabled={!editor} onClick={run((c) => c.toggleItalic())}>
          <Italic className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="ขีดฆ่า" active={s.strike} disabled={!editor} onClick={run((c) => c.toggleStrike())}>
          <Strikethrough className="h-4 w-4" />
        </ToolButton>
        <Divider />
        <ToolButton label="หัวข้อใหญ่" active={s.h2} disabled={!editor} onClick={run((c) => c.toggleHeading({ level: 2 }))}>
          <Heading2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="หัวข้อย่อย" active={s.h3} disabled={!editor} onClick={run((c) => c.toggleHeading({ level: 3 }))}>
          <Heading3 className="h-4 w-4" />
        </ToolButton>
        <Divider />
        <ToolButton label="รายการแบบจุด" active={s.bullet} disabled={!editor} onClick={run((c) => c.toggleBulletList())}>
          <List className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="รายการแบบตัวเลข" active={s.ordered} disabled={!editor} onClick={run((c) => c.toggleOrderedList())}>
          <ListOrdered className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="ข้อความอ้างอิง" active={s.quote} disabled={!editor} onClick={run((c) => c.toggleBlockquote())}>
          <Quote className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="เส้นคั่น" disabled={!editor} onClick={run((c) => c.setHorizontalRule())}>
          <Minus className="h-4 w-4" />
        </ToolButton>
        <Divider />
        <ToolButton label="แทรกลิงก์" active={s.link || linkOpen} disabled={!editor} onClick={openLink}>
          <Link2 className="h-4 w-4" />
        </ToolButton>
        {s.link && (
          <ToolButton label="ลบลิงก์" disabled={!editor} onClick={run((c) => c.extendMarkRange("link").unsetLink())}>
            <Unlink className="h-4 w-4" />
          </ToolButton>
        )}
        <ToolButton label="แทรกรูปภาพ" disabled={!editor || uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? <Spinner className="h-4 w-4" /> : <ImagePlus className="h-4 w-4" />}
        </ToolButton>
        <Divider />
        <ToolButton label="เลิกทำ" disabled={!s.canUndo} onClick={run((c) => c.undo())}>
          <Undo2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="ทำซ้ำ" disabled={!s.canRedo} onClick={run((c) => c.redo())}>
          <Redo2 className="h-4 w-4" />
        </ToolButton>
        <input
          ref={fileRef}
          type="file"
          accept={IMAGE_TYPES.join(",")}
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            uploadImage(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {linkOpen && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-brand-50/50 px-3 py-2">
          <input
            type="url"
            inputMode="url"
            autoFocus
            className="input h-9 min-w-0 flex-1 py-1 text-sm"
            placeholder="https://example.com"
            aria-label="ที่อยู่ลิงก์"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
              if (e.key === "Escape") setLinkOpen(false);
            }}
          />
          <button type="button" className="btn btn-primary btn-sm" onClick={applyLink}>
            ใช้ลิงก์
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setLinkOpen(false)}>
            ยกเลิก
          </button>
        </div>
      )}

      {editor ? (
        <EditorContent editor={editor} />
      ) : (
        <div className="flex min-h-[280px] items-center justify-center text-slate-400">
          <Spinner className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}
