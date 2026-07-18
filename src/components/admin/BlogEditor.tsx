import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

type BlogEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

// RESET STRATEGY:
// When the parent switches posts it passes a new `value`. The useEffect below resets the
// editor content ONLY when the incoming `value` actually differs from what the editor holds
// AND the editor is not currently focused. This avoids yanking the user's caret mid-edit while
// still reliably loading the correct content when opening a different post (at which point the
// editor is not focused). An alternative would be to re-key the editor by post id in the parent
// (key={editingPost ? editingPost.id : 'new'}) to fully remount it, but keeping a single mounted
// instance and resetting via this effect is the approach wired up here.
export default function BlogEditor({ value, onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '<p></p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (!editor.isFocused && value !== editor.getHTML()) {
      editor.commands.setContent(value || '<p></p>', false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
      active ? 'bg-primary/10 text-primary' : 'text-charcoal/50 hover:bg-bg'
    }`;

  return (
    <div className="rounded-xl border border-charcoal/5 bg-bg overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-charcoal/5 bg-white">
        <button type="button" className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </button>
        <button type="button" className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </button>
        <button type="button" className={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button type="button" className={btn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>
        <button type="button" className={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>
        <button type="button" className={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </button>
      </div>
      <EditorContent editor={editor} className="prose-editor" />
      <style>{`
        .prose-editor .ProseMirror {
          min-height: 12rem;
          padding: 1rem 1.25rem;
          outline: none;
          font-family: inherit;
          font-size: 0.875rem;
          color: #2b2b2b;
          line-height: 1.6;
        }
        .prose-editor .ProseMirror p { margin: 0.5rem 0; }
        .prose-editor .ProseMirror h2 { font-size: 1.25rem; font-weight: 800; margin: 0.75rem 0 0.5rem; }
        .prose-editor .ProseMirror h3 { font-size: 1.1rem; font-weight: 700; margin: 0.75rem 0 0.5rem; }
        .prose-editor .ProseMirror ul, .prose-editor .ProseMirror ol { padding-left: 1.25rem; margin: 0.5rem 0; }
        .prose-editor .ProseMirror a { color: #E58B6D; text-decoration: underline; }
      `}</style>
    </div>
  );
}
