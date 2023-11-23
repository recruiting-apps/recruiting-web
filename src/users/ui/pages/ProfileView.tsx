import { useEffect, useState } from 'react'
import { type User } from '@/users/models/user.interface'
import { useAuth } from '@/auth/hooks/useAuth'
import { UsersService } from '@/users/services/users.service'
import Divider from '@/shared/ui/components/utils/Divider'
import Button from '@/shared/ui/components/form/Button'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import UploadCvFileModal from '../components/UploadCvFileModal'
import { useNavigate } from 'react-router-dom'

const ProfileView: React.FC = () => {
  const { user: currentUser } = useAuth()

  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [showUploadCV, toggleShowUploadCV] = useBooleanState()

  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  useEffect(() => {
    if (!currentUser) return

    const { id } = currentUser

    void new UsersService()
      .findById(id)
      .then((response) => {
        setUser(response)
      })
  }, [])

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

  return (
    <div className='max-h-screen mb-5'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-semibold uppercase'>Profile</h1>
        <Button color={'primary'} onClick={handleEdit}>Edit profile</Button>
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
          <p className='' dangerouslySetInnerHTML={{ __html: user?.description?.replace(/\n/g, '<br>') ?? '' }}></p>

          <Divider className='mt-2 mb-1'></Divider>
          <h3 className='uppercase font-semibold'>Extra information</h3>

          <p>Phone: {user?.phone}</p>
          <p>Address: {user?.address}</p>

        </section>

        <main className='shadow-card px-6 py-4 rounded-md [&>h3]:uppercase [&>h3]:font-semibold'>

          <div className='flex justify-between items-center'>
            <h2 className='text-lg uppercase font-semibold'>Professional Information</h2>
            {(user && user?.cvPath.length > 0)
              ? <Button color='primary' onClick={handleDownloadCV}>Download CV</Button>
              : <Button color='primary' onClick={toggleShowUploadCV}>Upload CV</Button>}
          </div>
          <Divider className='mt-2 mb-2'></Divider>

          <h3>Education</h3>
          <p className='' dangerouslySetInnerHTML={{ __html: user?.education?.replace(/\n/g, '<br>') ?? '' }}></p>

          <Divider className='mt-2 mb-2'></Divider>

          <h3>Work Experience</h3>
          <p className='' dangerouslySetInnerHTML={{ __html: user?.workExperience?.replace(/\n/g, '<br>') ?? '' }}></p>

          <Divider className='mt-2 mb-2'></Divider>

          <h3>Abilities</h3>

          <div className='flex flex-wrap gap-2'>
            {
              user?.abilities.map(ability => (
                <p
                  className='bg-blue-era text-white rounded-md px-2 py-1 inline-block'
                  key={ability}>{ability}</p>
              ))
            }
          </div>
        </main>
      </div>

      {user && <UploadCvFileModal user={user} isOpen={showUploadCV} onClose={toggleShowUploadCV} />}
    </div>
  )
}

export default ProfileView
