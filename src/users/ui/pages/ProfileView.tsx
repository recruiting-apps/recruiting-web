import { useEffect, useState } from 'react'
import { type UserDto, type User } from '@/users/models/user.interface'
import { useAuth } from '@/auth/hooks/useAuth'
import { UsersService } from '@/users/services/users.service'
import Divider from '@/shared/ui/components/utils/Divider'
import Button from '@/shared/ui/components/form/Button'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import UploadCvFileModal from '../components/UploadCvFileModal'
import { useNavigate, useParams } from 'react-router-dom'
import parse from 'html-react-parser'
import { Role } from '@/users/models/enum/role.enum'
import PresentationLetterModal from '../components/PresentationLetterModal'
import AdditionalFileSection from '../components/AdditionalFileSection'
import { type AdditionalFile } from '@/users/models/additional-file.interface'

const ProfileView: React.FC = () => {
  const { id: userId } = useParams()
  const { user: currentUser } = useAuth()

  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [showUploadCV, toggleShowUploadCV] = useBooleanState()
  const [showPresentationLetters, toggleShowPresentationLetters] = useBooleanState()

  const [imageError, setImageError] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  const hasCv = user && user?.cvPath.length > 0

  const handleImageError = () => {
    setImageError(true)
  }

  useEffect(() => {
    const id = userId ?? currentUser?.id

    if (!id) return

    void new UsersService()
      .findById(+id)
      .then((response) => {
        setUser(response)
      })
  }, [userId, currentUser])

  useEffect(() => {
    if (userId === undefined && currentUser !== null) {
      setIsOwnProfile(true)
      return
    }

    if (userId !== undefined && currentUser?.id === +userId) {
      setIsOwnProfile(true)
      return
    }

    setIsOwnProfile(false)
  }, [currentUser, user])

  const handleDownloadCV = () => {
    if (!user) return
    const url = user?.cvPath
    console.log(url)

    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', url)
    downloadAnchorNode.setAttribute('target', '_blank')
    downloadAnchorNode.setAttribute('download', `CV-${user?.fullName}.pdf`)
    downloadAnchorNode.click()
  }

  const handleEdit = () => {
    navigate(`/profile/edit/${user?.id ?? ''}`)
  }

  const handleUpdateUser = async (newUser: UserDto) => {
    if (!user) return

    const updatedUser = await new UsersService().update(newUser, user.id)
    setUser(updatedUser)
  }

  const onAddFile = (file: AdditionalFile) => {
    if (!user) return

    setUser({
      ...user,
      files: [...user.files, file]
    })
  }

  const onRemoveFile = (id: number) => {
    if (!user) return

    setUser({
      ...user,
      files: user.files.filter(file => file.id !== id)
    })
  }

  return (
    <div className='max-h-screen mb-5'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-semibold uppercase'>Profile</h1>

        <div className='flex gap-2 items-center'>
          {user?.role === Role.APPLICANT && isOwnProfile &&
            <Button color='secondary' onClick={toggleShowPresentationLetters}>Presentation Letters</Button>
          }
          {isOwnProfile && <Button color={'primary'} onClick={handleEdit}>Edit profile</Button>}
        </div>
      </div>

      <Divider className='mt-2' />

      <div className='grid grid-cols-[1fr_3fr] gap-3'>
        <section className='shadow-card py-5 px-4 rounded-md'>
          <div className='w-[250px] h-[250px] mx-auto'>
            {imageError
              ? (
                <img
                  className='w-full h-full object-cover rounded-full'
                  src="profile.jpg"
                  alt="Default Image"
                />
                )
              : (
                <img
                  className='w-full h-full object-cover rounded-full'
                  src={user?.profileImagePath} alt={`Image profile ${user?.fullName}`}
                  onError={handleImageError}
                />
                )}
          </div>

          <Divider className='mt-2 mb-2'></Divider>

          <h2 className='text-center text-lg uppercase font-semibold'>{user?.fullName}</h2>
          <p className='text-center font-semibold uppercase'>{user?.profession}</p>
          <p className='text-center'>{user?.email}</p>

          <Divider className='mt-2 mb-1'></Divider>
          <h3 className='uppercase font-semibold'>Summary</h3>
          <div>
            {parse(user?.description?.replace(/\n/g, '<br>') ?? '')}
          </div>

          <Divider className='mt-2 mb-1'></Divider>
          <h3 className='uppercase font-semibold'>Extra information</h3>

          <p>Phone: {user?.phone}</p>
          <p>Address: {user?.address}</p>
        </section>

        <div>
          <main className='shadow-card px-6 py-4 rounded-md [&>h3]:uppercase [&>h3]:font-semibold'>
            <div className='flex justify-between items-center'>
              <h2 className='text-lg uppercase font-semibold'>Professional Information</h2>
              <div className='flex gap-2'>
                {isOwnProfile && <Button color='primary' onClick={toggleShowUploadCV}>{hasCv ? 'Edit CV' : 'Upload CV'}</Button>}
                {hasCv && <Button color='primary' onClick={handleDownloadCV}>Download CV</Button>}
              </div>
            </div>
            <Divider className='mt-2 mb-2'></Divider>

            <h3>Education</h3>
            <div>
              {
                user?.education?.length === 0 &&
                <p>No education information found</p>
              }
              {parse(user?.education?.replace(/\n/g, '<br>') ?? '')}
            </div>

            <Divider className='mt-2 mb-2'></Divider>

            <h3>Work Experience</h3>
            <div>
              {
                user?.workExperience?.length === 0 &&
                <p>No work experience found</p>
              }
              {parse(user?.workExperience?.replace(/\n/g, '<br>') ?? '')}
            </div>

            <Divider className='mt-2 mb-2'></Divider>

            <h3>Abilities</h3>

            <div className='flex flex-wrap gap-2'>
              {
                user?.abilities.length === 0 &&
                <p>No abilities found</p>
              }
              {
                user?.abilities.map(ability => (
                  <p
                    className='bg-blue-era text-white rounded-md px-2 py-1 inline-block'
                    key={ability}>{ability}</p>
                ))
              }
            </div>
          </main>

          <AdditionalFileSection
            onRemoveFile={onRemoveFile}
            onAddFile={onAddFile}
            files={user?.files ?? []} isOwnProfile={isOwnProfile}
          />
        </div>
      </div>

      {user && <UploadCvFileModal user={user} isOpen={showUploadCV} onClose={toggleShowUploadCV} />}

      {user && <PresentationLetterModal
        isOpen={showPresentationLetters}
        onClose={toggleShowPresentationLetters}
        user={user}
        onUserChange={handleUpdateUser}
      ></PresentationLetterModal>}
    </div>
  )
}

export default ProfileView
