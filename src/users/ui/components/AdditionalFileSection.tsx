import { useAuth } from '@/auth/hooks/useAuth'
import { uploadFile } from '@/shared/config/firebase/storage'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { useToast } from '@/shared/hooks/useToast'
import { DownloadFileIcon } from '@/shared/ui/assets/icons/AppIcons'
import Button from '@/shared/ui/components/form/Button'
import FileInput from '@/shared/ui/components/form/FileInput'
import Divider from '@/shared/ui/components/utils/Divider'
import Modal from '@/shared/ui/components/utils/Modal'
import { type AdditionalFile } from '@/users/models/additional-file.interface'
import { AdditionalFilesService } from '@/users/services/files.service'
import { useState } from 'react'

interface AdditionalFileSectionProps {
  files: AdditionalFile[]
  isOwnProfile: boolean
  onAddFile: (additionalFile: AdditionalFile) => void
}

const AdditionalFileSection: React.FC<AdditionalFileSectionProps> = ({ files, isOwnProfile, onAddFile }) => {
  const { user } = useAuth()
  const [showAdditionalFile, toggleShowAdditionalFile] = useBooleanState()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    await uploadFile(file, `/users/${user?.id}/additional-files`)
      .then(async ({ originalName, url }) => {
        await new AdditionalFilesService()
          .create({ name: originalName, path: url })
          .then((file) => {
            onAddFile(file)
            useToast({ message: 'File uploaded successfully', type: 'success' })
          })
          .catch((error) => {
            const { message } = error.data
            useToast({ message, type: 'error' })
          })
      })
      .catch((error) => {
        useToast({ message: error.message, type: 'error' })
      })
      .finally(() => {
        setFile(null)
        toggleShowAdditionalFile()
        setIsUploading(false)
      })
  }

  return (
    <div className='shadow-card px-6 py-4 rounded-md mt-5 [&>div>h3]:uppercase [&>div>h3]:font-semibold'>
      <div className='flex justify-between items-center'>
        <h3>Additional Documents</h3>
        {isOwnProfile && <Button color='primary' onClick={toggleShowAdditionalFile}>Add new File</Button>}
      </div>

      <Divider className='my-[5px]'></Divider>

      {
        files.length > 0
          ? (
            <ul className='grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mt-5'>
              {files.map((file) => (
                <li key={file.id}
                  className='px-3 py-1 bg-gray-200 rounded-md'
                >
                  <a
                    className='flex gap-1 justify-between items-center'
                    href={file.path} target='_blank' rel="noreferrer">
                    <p>{file.name}</p>
                    <DownloadFileIcon
                      className='w-6 h-6'
                    />
                  </a>
                </li>
              ))}
            </ul>
            )
          : (
            <p>No files uploaded</p>
            )
      }

      <Modal isOpen={showAdditionalFile} onClose={toggleShowAdditionalFile}>
        <h3 className='text-center uppercase font-semibold'>Add new file</h3>
        <Divider className='my-[5px]'></Divider>

        <FileInput
          file={file}
          setFile={setFile}
          admittedExtensions={['pdf', 'doc', 'docx', 'txt']}
        ></FileInput>

        <footer className='flex gap-2 items-center mt-4'>
          <Button color='primary'
            onClick={() => { void handleUpload() }}
            isLoading={isUploading}
          >Upload</Button>
          <Button color='danger'
            onClick={() => {
              setFile(null)
              toggleShowAdditionalFile()
            }}
          >Close</Button>
        </footer>
      </Modal>
    </div>
  )
}

export default AdditionalFileSection
