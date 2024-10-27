import { type Offer } from '@/offers/models/offer.interface'
import Button from '@/shared/ui/components/form/Button'
import Divider from '@/shared/ui/components/utils/Divider'
import Modal from '@/shared/ui/components/utils/Modal'
import { type User, type PresentationLetter } from '@/users/models/user.interface'
import { useEffect, useState } from 'react'
import { useOffersQuery } from '../hooks/useOffersQuery'
import { useLoading } from '@/shared/hooks/useLoading'
import { OffersService } from '@/offers/services/offers.service'
import { useToast } from '@/shared/hooks/useToast'
import { handleDownloadFormUrl } from '@/utils'
import { useNavigate } from 'react-router-dom'

interface ApplyModalProps {
  isOpen: boolean
  onClose: () => void
  offer: Offer
  user: User
}

const ApplyModal: React.FC<ApplyModalProps> = ({ isOpen, offer, user, onClose }) => {
  const navigate = useNavigate()
  const { handleUpdateOffer } = useOffersQuery()

  const [presentationLetters, setPresentationLetters] = useState<PresentationLetter[]>(user.presentationLetters)
  const [selectedPresentationLetter, setSelectedPresentationLetter] = useState<PresentationLetter | null>(null)

  const [applying, setApplying] = useState(false)

  const {
    loading: downloading,
    startLoading: startDownloading,
    stopLoading: stopDownloading
  } = useLoading({})

  useEffect(() => {
    setPresentationLetters(user.presentationLetters)
  }, [user])

  const handleApply = () => {
    if (!offer) return

    setApplying(true)
    void new OffersService()
      .apply(offer.id, {
        letter: selectedPresentationLetter?.content ?? undefined
      })
      .then(async (response) => {
        await handleUpdateOffer(response)
        useToast({ message: 'Applied successfully', type: 'success' })
        onClose()
      })
      .catch((error) => {
        const { message } = error.data
        useToast({ message, type: 'error' })
      })
      .finally(() => {
        setApplying(false)
        onClose()
      })
  }

  const handleSelectPresentationLetter = (letter: PresentationLetter) => () => {
    setSelectedPresentationLetter(letter.name === selectedPresentationLetter?.name ? null : letter)
  }

  const handleDownloadCV = () => {
    if (!user) return

    startDownloading()
    void handleDownloadFormUrl(user.cvPath, `CV-${user?.fullName}`)
      .finally(stopDownloading)
  }

  const handleChangeCV = () => {
    navigate('/profile/detail', { state: { showUploadCVToApply: true } })
  }

  const handleAddPresentationLetter = () => {
    navigate('/profile/detail', { state: { showPresentationLettersToApply: true } })
  }

  return (

    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className='font-semibold text-center uppercase'>Apply to {offer?.title}</h3>
      <p className='font-semibold text-center text-gray-600'>Are you sure you want to apply to this offer?</p>

      <Divider className=''></Divider>

      <h3 className='font-semibold'>Select your CV:</h3>

      <div className='flex gap-2 items-center mt-1 justify-center [&>button]:w-full'>
        <Button color='primary' onClick={handleDownloadCV} isLoading={downloading}>Current CV</Button>
        <Button color='secondary' onClick={handleChangeCV}>Change CV</Button>
      </div>

      <Divider></Divider>

      <h3 className='font-semibold'>Do you want to select a letter for this offer?</h3>
      {
        presentationLetters.length === 0 && (
          <>
            <p className='text-sm text-gray-600'>You don{"'"}t have any presentation letter, please create one in your profile</p>
            <Button color='secondary' className='text-xs mt-1' onClick={handleAddPresentationLetter}>Add Presentation Letter</Button>
          </>
        )
      }

      {presentationLetters.length > 0 && (
        <ul>
          {
            presentationLetters.map(letter => (
              <li
                className={`p-2  rounded-md cursor-pointer ${selectedPresentationLetter?.name === letter.name ? 'bg-blue-era text-white' : 'bg-gray-200'}`}
                key={letter.name} onClick={handleSelectPresentationLetter(letter)}>
                <p>{letter.name}</p>
              </li>
            ))
          }
        </ul>
      )}

      <div className='flex justify-end gap-2 mt-4'>
        <Button color='danger' onClick={onClose}>Cancel</Button>
        <Button color='primary' isLoading={applying} onClick={handleApply}>Apply</Button>
      </div>
    </Modal>
  )
}

export default ApplyModal
