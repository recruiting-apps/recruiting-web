import { useToast } from '@/shared/hooks/useToast'
import { UploadFileIcon } from '@/shared/ui/assets/icons/AppIcons'
import { useRef } from 'react'

interface InputFileProps {
  file: File | null
  setFile: (file: File | null) => void
  maxSize?: number
  admittedExtensions?: string[]
  disabled?: boolean
}

const InputFile: React.FC<InputFileProps> = ({
  file,
  setFile,
  maxSize,
  admittedExtensions = [],
  disabled
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (): void => {
    const files = inputRef.current?.files

    if (!files || files.length === 0) return

    const file = files[0]

    const { name } = file
    const lastDot = name.lastIndexOf('.')
    const ext = name.substring(lastDot + 1)

    if (!admittedExtensions.includes(ext)) {
      useToast({ message: `File must be ${admittedExtensions.join(' ')}`, type: 'error' })
      return
    }

    if (maxSize && file.size > maxSize * 1024 * 1024) {
      useToast({ message: `Max size is ${maxSize}MB`, type: 'error' })
      return
    }

    setFile(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <p>Select a file</p>
      <label htmlFor="fileInput" className={`px-4 py-2 border ${file ? 'bg-gray-300' : 'border-gray-300'} rounded-lg cursor-pointer flex justify-between`}>
        <span>{file ? file.name : 'Select a file'}</span>
        <UploadFileIcon className='w-5 h-5' />
      </label>
      <input
        id="fileInput"
        type="file"
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
        accept={admittedExtensions.map((ext) => `.${ext}`).join(',')}
      />
    </div>
  )
}

export default InputFile
