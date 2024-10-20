import { type Application } from '@/offers/models/application.interface'
import { Status } from '@/offers/models/enums/status.enum'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import Button from '@/shared/ui/components/form/Button'
import Divider from '@/shared/ui/components/utils/Divider'
import Modal from '@/shared/ui/components/utils/Modal'
import moment from 'moment'
import { useOfferDetailQuery } from '../hooks/useOfferDetailQuery'
import { OffersService } from '@/offers/services/offers.service'
import { useToast } from '@/shared/hooks/useToast'
import { Link } from 'react-router-dom'
import { handleDownloadFormUrl } from '@/utils'
import { useLoading } from '@/shared/hooks/useLoading'

interface ApplicantCardProps {
  application: Application
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ application }) => {
  const { offer, refetch, betterApplicant } = useOfferDetailQuery()
  const [showLetter, toggleShowLetter] = useBooleanState()
  const [showModal, toggleShowModal] = useBooleanState()

  const {
    loading,
    startLoading,
    stopLoading
  } = useLoading({})

  const handleSelectApplicant = () => {
    void new OffersService()
      .selectApplicant(offer?.id ?? 0, application.id)
      .then(async () => {
        await refetch()
        useToast({ message: 'Applicant selected successfully', type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        useToast({ message, type: 'error' })
      })
      .finally(() => {
        toggleShowModal()
      })
  }

  const handleDownloadCV = () => {
    const url = application.user?.cvPath
    startLoading()
    void handleDownloadFormUrl(url, `CV-${application.user?.fullName}`)
      .finally(stopLoading)
  }

  return (
    <div className={`${application.status === Status.ACCEPTED ? 'bg-success text-white' : 'bg-gray-100'} border p-3 rounded-md hover:border-blue-era transition-all duration-100 mb-2`}>
      <header>
        <h4 className='font-bold'>{application.user.fullName}</h4>
      </header>
      <p>{application.user.email}</p>
      <p className='text-sm'>Order: {application.order + 1}</p>

      <p className='text-sm font-semibold'>{moment(application.applicationDate).fromNow()}</p>

      <footer className='flex items-center justify-end gap-1'>
        <Button color='primary' className='text-xs' onClick={handleDownloadCV} isLoading={loading}>Download CV</Button>
        {
          application.letter !== null && application.letter.length > 0 && (
            <Button color='primary' className='text-xs' onClick={toggleShowLetter}>Show Presentation Letter</Button>
          )
        }
        <Link to={`/profile/detail/${application.user.id}`}>
          <Button color='secondary' className='text-xs '>Show Profile</Button>
        </Link>

        {betterApplicant === null && <Button className='text-xs' color='primary' onClick={toggleShowModal}>
          Select Applicant
        </Button>}
      </footer>

      <Modal isOpen={showLetter} onClose={toggleShowLetter}>
        <h3 className='text-xl font-semibold'>Presentation Letter</h3>
        <Divider className='my-2' />
        <p>{application.letter}</p>
      </Modal>

      <Modal isOpen={showModal} onClose={toggleShowModal}>
        <h3 className='text-center font-semibold text-lg'>Are you sure you want to select this application?</h3>
        <p className='text-center'>{application.order + 1} {application.user.fullName}</p>
        <Divider className='my-1' />
        <div className='flex justify-end gap-2'>
          <Button color='primary' onClick={handleSelectApplicant}>Select applicant</Button>
          <Button color='secondary' onClick={toggleShowModal}>Cancel</Button>
        </div>
      </Modal>
    </div>
  )
}

export default ApplicantCard
