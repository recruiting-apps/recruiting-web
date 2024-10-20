import UploadProfileImage from '@/auth/ui/components/UploadProfileImage'
import { uploadFile } from '@/shared/config/firebase/storage'
import { useLoading } from '@/shared/hooks/useLoading'
import { useToast } from '@/shared/hooks/useToast'
import Button from '@/shared/ui/components/form/Button'
import Divider from '@/shared/ui/components/utils/Divider'
import Modal from '@/shared/ui/components/utils/Modal'
import { useState } from 'react'

interface UploadProfileImageModalProps {
  onSuccessfulUpload: (url: string) => void
  isOpen: boolean
  onClose: () => void
}

const UploadProfileModalImage: React.FC<UploadProfileImageModalProps> = ({ isOpen, onClose, onSuccessfulUpload }) => {
  const [file, setFile] = useState<File | null>(null)
  const {
    loading,
    startLoading,
    stopLoading
  } = useLoading({})

  const handleConfirm = () => {
    if (!file) return

    startLoading()
    void uploadFile(file, 'profile-images')
      .then((response) => {
        onSuccessfulUpload(response.url)
        onClose()
        useToast({ type: 'success', message: 'Image uploaded successfully' })
      })
      .catch((error) => {
        console.error(error)
        useToast({ type: 'error', message: 'Error uploading image' })
      })
      .finally(stopLoading)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className='text-center uppercase font-semibold text-lg'>Update profile Image</h2>
      <Divider className='my-2 mb-5'></Divider>

      <UploadProfileImage
        setImageFile={setFile}
      />

      {file && <footer className='mt-2 flex gap-2 items-center justify-center'>
        <Button color='primary' onClick={handleConfirm} isLoading={loading}>Confirm</Button>
        <Button color='secondary' onClick={onClose}>Cancel</Button>
      </footer>}
    </Modal>
  )
}

export default UploadProfileModalImage
