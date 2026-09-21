import { useEffect, useRef, useState, type ReactNode } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder: string
  invalid?: boolean
  errorId?: string
}

const TRACKED_COMMANDS = [
  'bold',
  'italic',
  'underline',
  'strikeThrough',
  'insertUnorderedList',
  'insertOrderedList',
]

export default function RichTextEditor({ value, onChange, placeholder, invalid = false, errorId }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const savedRangeRef = useRef<Range | null>(null)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  // Keep the editor in sync when `value` changes from outside (loading a goal to
  // edit, applying a library template) — but never while the user is actively
  // typing in it, or we'd fight their cursor.
  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    if (document.activeElement === el) return
    if (el.innerHTML !== (value || '')) {
      el.innerHTML = value || ''
    }
  }, [value])

  // The Selection can move (or collapse) the instant focus leaves the editor —
  // which happens the moment a toolbar <button> is pressed. We snapshot the
  // Range on every interaction inside the editor, then restore it right before
  // running a command, so formatting always applies to what the user actually
  // selected instead of wherever the cursor happens to land after refocusing.
  const saveSelection = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && editorRef.current && editorRef.current.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange()
    }
  }

  const restoreSelection = () => {
    const sel = window.getSelection()
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges()
      sel.addRange(savedRangeRef.current)
    }
  }

  const refreshActiveFormats = () => {
    const next = new Set<string>()
    TRACKED_COMMANDS.forEach((cmd) => {
      try {
        if (document.queryCommandState(cmd)) next.add(cmd)
      } catch {
        // some browsers throw for unsupported/irrelevant queries — ignore
      }
    })
    setActiveFormats(next)
  }

  const handleSelectionTracking = () => {
    saveSelection()
    refreshActiveFormats()
  }

  const runCommand = (command: string, arg?: string) => {
    editorRef.current?.focus()
    restoreSelection()
    document.execCommand(command, false, arg)
    saveSelection()
    refreshActiveFormats()
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }

  const handleLink = () => {
    const url = window.prompt('Link URL')
    if (url) runCommand('createLink', url)
  }

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML)
    saveSelection()
    refreshActiveFormats()
  }

  return (
    <div className={`mt-1.5 border rounded-xl overflow-hidden ${invalid ? 'border-red-500' : 'border-gray-300'}`}>
      <div className="flex items-center flex-wrap gap-1 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
        <ToolbarButton active={activeFormats.has('bold')} onClick={() => runCommand('bold')} label="Bold">
          <span className="text-xs font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton active={activeFormats.has('italic')} onClick={() => runCommand('italic')} label="Italic">
          <span className="text-xs italic">I</span>
        </ToolbarButton>
        <ToolbarButton active={activeFormats.has('underline')} onClick={() => runCommand('underline')} label="Underline">
          <span className="text-xs underline">U</span>
        </ToolbarButton>
        <ToolbarButton
          active={activeFormats.has('strikeThrough')}
          onClick={() => runCommand('strikeThrough')}
          label="Strikethrough"
        >
          <span className="text-xs line-through">S</span>
        </ToolbarButton>
        <span className="w-px h-4 bg-gray-300 mx-1" />
        <ToolbarButton
          active={activeFormats.has('insertUnorderedList')}
          onClick={() => runCommand('insertUnorderedList')}
          label="Bullet list"
        >
          <BulletListIcon />
        </ToolbarButton>
        <ToolbarButton
          active={activeFormats.has('insertOrderedList')}
          onClick={() => runCommand('insertOrderedList')}
          label="Numbered list"
        >
          <NumberedListIcon />
        </ToolbarButton>
        <ToolbarButton onClick={handleLink} label="Insert link">
          <LinkIcon />
        </ToolbarButton>
        <ToolbarButton onClick={() => runCommand('indent')} label="Indent">
          <IndentIcon />
        </ToolbarButton>
      </div>

      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-invalid={invalid}
        aria-describedby={errorId}
        data-placeholder={placeholder}
        onInput={handleInput}
        onMouseUp={handleSelectionTracking}
        onKeyUp={handleSelectionTracking}
        onBlur={saveSelection}
        className="rich-text-editable w-full min-h-[110px] px-4 py-3 text-sm text-gray-700 focus:outline-none"
      />
    </div>
  )
}

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean
  onClick: () => void
  label: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      // Prevent the mousedown from stealing focus/selection away from the editor
      // before execCommand runs against the current selection.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`w-6 h-6 rounded flex items-center justify-center ${
        active ? 'bg-teal-brand text-white' : 'text-gray-500 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

function BulletListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="3.5" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function NumberedListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10 6h11M10 12h11M10 18h11" />
      <text x="0" y="8" fontSize="7" fill="currentColor" stroke="none">1</text>
      <text x="0" y="14" fontSize="7" fill="currentColor" stroke="none">2</text>
      <text x="0" y="20" fontSize="7" fill="currentColor" stroke="none">3</text>
    </svg>
  )
}
function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1-1" />
    </svg>
  )
}
function IndentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5h18M3 12h18M3 19h18M8 8l4 4-4 4" />
    </svg>
  )
}
