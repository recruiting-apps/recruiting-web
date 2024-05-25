import { useEffect, useRef, useState } from 'react'

interface TextareaProps extends React.HTMLProps<HTMLTextAreaElement> {
  value?: string
  resetFlag?: boolean
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  name,
  className = '',
  required = true,
  placeholder,
  value,
  resetFlag,
  onChange,
  disabled = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [val, setVal] = useState<string | undefined>(value)

  useEffect(() => {
    setVal(value)
  }, [value])

  useEffect(() => {
    if (resetFlag) {
      setVal('')
    }
  }, [resetFlag])

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { value } = event.target
    setVal(value)
    onChange?.(event)
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`
    }
  }, [val, textareaRef])

  return (

    <label>{label} {!required && <span className='text-red-600'>(opcional)</span>}
      <textarea
        ref={textareaRef}
        className={`mt-1 block w-full h-24 min-h-[6rem] max-h-[300px] px-2 py-1 border border-gray-300 rounded-md border-solid outline-none focus:shadow-blue focus:shadow-input-focus disabled:bg-gray-200 disabled:text-gray-500 ${className}`}
        disabled={disabled} name={name} placeholder={placeholder} value={val} onChange={handleChange} required={required}
      />
    </label>
  )
}

export default Textarea
