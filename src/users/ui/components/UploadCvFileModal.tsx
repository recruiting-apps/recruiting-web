import UploadCvPdf from '@/auth/ui/components/UploadCvPdf'
import { uploadFile } from '@/shared/config/firebase/storage'
import { useLoading } from '@/shared/hooks/useLoading'
import { useToast } from '@/shared/hooks/useToast'
import Button from '@/shared/ui/components/form/Button'
import Divider from '@/shared/ui/components/utils/Divider'
import Modal from '@/shared/ui/components/utils/Modal'
import { type UserDto, type User } from '@/users/models/user.interface'
import { UsersService } from '@/users/services/users.service'
import { useState } from 'react'

interface UploadCvFileModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
}

const UploadCvFileModal: React.FC<UploadCvFileModalProps> = ({ isOpen, onClose, user }) => {
  const [file, setFile] = useState<File | null>(null)
  const { loading, startLoading, stopLoading } = useLoading({})

  const onConfirm = async () => {
    if (!file) {
      useToast({ type: 'error', message: 'You must upload a CV' })
      return
    }

    startLoading()

    await uploadFile(file, 'cv')
      .then(async ({ url }) => {
        const userDto: UserDto = {
          abilities: user.abilities,
          email: user.email,
          profession: user.profession,
          profileImagePath: user.profileImagePath,
          cvPath: url,
          address: user.address,
          bornDate: user.bornDate,
          description: user.description,
          education: user.education,
          googleAccount: user.googleAccount,
          lastName: user.lastName,
          name: user.name,
          password: '',
          phone: user.phone,
          role: user.role,
          workExperience: user.workExperience,
          emailNotification: user.emailNotification,
          presentationLetters: user.presentationLetters
        }

        await new UsersService()
          .update(userDto, user.id)
          .then(() => {
            useToast({ type: 'success', message: 'CV uploaded successfully' })
            onClose()
            window.location.reload()
          })
      })
      .finally(stopLoading)
  }

  const handleClose = () => {
    setFile(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>

      <h1 className='text-center text-2xl font-semibold'>Upload your CV</h1>
      <p className='text-gray-500 text-center mt-2'>Upload your CV to apply for the job offer</p>
      <div className='flex justify-center mt-3'>
        <UploadCvPdf
          file={file}
          setCvFile={setFile}
        />
      </div>

      <Divider className='my-1' />

      <div className='flex gap-2 justify-end'>
        <Button color='primary' onClick={() => { void onConfirm() }} isLoading={loading}>Confirm Upload CV</Button>
        <Button color='secondary' onClick={handleClose}>Cancel</Button>
      </div>

    </Modal>
  )
}

export default UploadCvFileModal
