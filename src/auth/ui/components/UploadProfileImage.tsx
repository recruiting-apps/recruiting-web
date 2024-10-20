import { useToast } from '@/shared/hooks/useToast'
import Button from '@/shared/ui/components/form/Button'
import { useRef, useState } from 'react'

interface UploadProfileImageProps {
  setImageFile: (file: File | null) => void
}

const UploadProfileImage: React.FC<UploadProfileImageProps> = ({ setImageFile }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    const extension = file?.name.split('.').pop()

    if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
      useToast({ type: 'error', message: 'El archivo debe ser una imagen' })
      setImageFile(null)
      setImagePreview(null)
      return
    }

    if (file) {
      setImageFile(file)
      const reader = new FileReader()

      reader.onload = (e) => {
        if (!e.target) return
        setImagePreview(e.target.result)
      }

      reader.readAsDataURL(file)
    } else {
      setImageFile(null)
      setImagePreview(null)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      {imagePreview && (
        <img
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          src={imagePreview.toString()}
          alt='profile'
          className='w-24 h-24 rounded-full mt-2 mb-2 object-contain'
        />
      )}
      <label htmlFor='profile-image' className='flex flex-col items-center justify-center'>
        <Button color="primary" onClick={() => {
          inputRef.current?.click()
        }}>Upload Profile Image</Button>
      </label>
      <input
        required={true}
        ref={inputRef}
        id='profile-image'
        type='file'
        className='hidden'
        accept='image/*'
        onChange={handleImageChange}
      />

    </div>
  )
}

export default UploadProfileImage
