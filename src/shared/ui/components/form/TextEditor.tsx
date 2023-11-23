import React, { useRef, useMemo, useState } from 'react'
import JoditEditor from 'jodit-react'

interface TextEditorProps {
  label: string
  content: string
  handleChange: (value: string) => void
  readonly?: boolean
}

const TextEditor: React.FC<TextEditorProps> = ({ label, content, readonly = false, handleChange }) => {
  const editor = useRef(null)
  const [showToolbar] = useState(false)

  const config = useMemo(() => {
    return {
      readonly,
      disablePlugins: ['table', 'source', 'clipboard', 'search', 'print', 'preview', 'about', 'video', 'image', 'file', 'link', 'spellcheck', 'poweredByJodit', 'symbols'],
      language: 'es',
      toolbar: showToolbar
    }
  }, [showToolbar, readonly])

  return (
    <div>
      <p>{label}</p>
      <JoditEditor
        className='my-3'
        ref={editor}
        value={content}
        onChange={handleChange}
        config={config}
      />
    </div>
  )
}

export default TextEditor
