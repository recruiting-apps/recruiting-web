import { useToast } from '@/shared/hooks/useToast'
import Button from '@/shared/ui/components/form/Button'
import { useRef } from 'react'

interface UploadCvPdfProps {
  file: File | null
  setCvFile: (file: File | null) => void
}

const UploadCvPdf: React.FC<UploadCvPdfProps> = ({ file, setCvFile }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      setCvFile(null)
      useToast({ type: 'error', message: 'No file selected' })
      return
    }

    const extension = file.name.split('.').pop()

    if (extension !== 'pdf') {
      useToast({ type: 'error', message: 'El archivo debe ser un PDF' })
      setCvFile(null)
      return
    }

    if (file.size > 4 * 1024 * 1024) {
      useToast({ message: 'Max size is 4MB', type: 'error' })
      return
    }

    setCvFile(file ?? null)
  }

  return (
    <div className='flex items-center gap-2'>

      <label htmlFor='profile-image' className='flex flex-col items-center justify-center'>
        <Button color="primary" onClick={() => {
          inputRef.current?.click()
        }}>Upload CV</Button>

        <input
          ref={inputRef}
          id='profile-image'
          type='file'
          className='hidden'
          onChange={handleImageChange}
          accept='.pdf'
        />
      </label>
      {
        file && (
          <p className='text-center bg-gray-400 text-white py-1 px-3 rounded-md'>
            {file.name}
          </p>
        )
      }
    </div>
  )
}

export default UploadCvPdf
