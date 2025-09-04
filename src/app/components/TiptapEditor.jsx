'use client'; // ต้องอยู่บรรทัดแรก สำหรับ Client Component

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function TiptapEditor({ content, onUpdate }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '<p>Hello World!</p>', // ถ้าไม่ได้ส่ง content มา ใช้ค่าเริ่มต้น
    immediatelyRender: false, // ป้องกัน SSR hydration mismatch
    onUpdate: ({ editor }) => {
      const html = editor.getHTML(); // ดึงเนื้อหา HTML
      if (onUpdate) onUpdate(html);   // เรียก callback ถ้ามี
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none border p-4 rounded',
      },
    },
  });

  return <EditorContent editor={editor} />;
}
