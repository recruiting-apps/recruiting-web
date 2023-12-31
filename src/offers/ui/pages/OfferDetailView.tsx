import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { type Offer } from '@/offers/models/offer.interface'
import Divider from '@/shared/ui/components/utils/Divider'
import { OffersService } from '@/offers/services/offers.service'
import { useToast } from '@/shared/hooks/useToast'
import moment from 'moment'
import Button from '@/shared/ui/components/form/Button'
import { type Application } from '@/offers/models/application.interface'
import { Status } from '@/offers/models/enums/status.enum'
import { useLoading } from '@/shared/hooks/useLoading'

const OfferDetailView: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [offer, setOffer] = useState<Offer | null>(null)
  const [betterApplicant, setBetterApplicant] = useState<Application | null>(null)

  const { loading, startLoading, stopLoading } = useLoading({})

  useEffect(() => {
    const id = params.id

    if (!id) return

    void new OffersService()
      .findById(id)
      .then((offer) => {
        setOffer(offer)

        const application = offer.applications.find(application => application.status === Status.ACCEPTED)
        setBetterApplicant(application ?? null)
      })
      .catch((error) => {
        const { message } = error.data
        useToast({ message, type: 'error' })
      })
  }, [])

  const handleEditOffer = () => {
    navigate(`/my-offers/offer-form-edit/${offer?.id ?? ''}`)
  }

  const onCloseOffer = () => {
    void new OffersService()
      .close(offer?.id ?? '')
      .then((offer) => {
        setOffer(offer)
        useToast({ message: 'Offer closed successfully', type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        useToast({ message, type: 'error' })
      })
  }

  const findBetterApplicant = () => {
    startLoading()
    void new OffersService()
      .findBetterApplicant(offer?.id ?? '')
      .then((offer) => {
        const application = offer.applications.find(application => application.status === Status.ACCEPTED)
        setBetterApplicant(application ?? null)
        useToast({ message: 'Better applicant found', type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        useToast({ message, type: 'error' })
      })
      .finally(() => {
        stopLoading()
      })
  }

  return (
    <div className='grid grid-cols-2 gap-2'>
      <div className='shadow-card-bold rounded-md p-4 '>
        <header className='flex justify-between gap-2'>
          <div>
            <h2 className='text-xl font-semibold'>{offer?.title}</h2>
            <p>{offer?.location}</p>
          </div>
        </header>
        <Divider className='my  -2' />
        <div className='[&>p]:font-semibold [&>p>span]:font-normal mb-3'>
          <p>Company: <span>{offer?.company}</span></p>
          {String(offer?.salary ?? '').length > 0 && <p>Salary: <span>{offer?.salary}</span></p>}
          <p>Expiration Date: <span>{moment(offer?.expirationDate).format('DD/MM/YYYY')}</span></p>
        </div>
        <p className='' dangerouslySetInnerHTML={{ __html: offer?.description?.replace(/\n/g, '<br>') ?? '' }}></p>
        {
          offer && offer.expectedAbilities.length > 0 && (
            <div className='my-3'>
              <h3 className='font-semibold'>Expected Abilities</h3>
              <ul className='flex flex-wrap gap-1'>
                {offer?.expectedAbilities.map(ability => (
                  <li key={ability}
                    className='bg-blue-era text-white p-1 rounded-md text-sm'
                  >{ability}</li>
                ))}
              </ul>
            </div>
          )
        }

        <div className='flex justify-end gap-2'>
          {!offer?.closed && <Button color='primary' onClick={onCloseOffer}>Close Offer</Button>}
          <Button color='secondary' onClick={handleEditOffer}>Edit Job Offer</Button>
        </div>
      </div>

      <div>
        <div className='shadow-card-bold rounded-md p-4 '>
          <h3 className='text-xl font-semibold'>Applications</h3>
          <Divider className='my-2' />
          {
            offer?.applications.length === 0 && (
              <p className=''>There are no applications yet</p>
            )
          }
          {
            offer?.applications.map(application => (
              <div key={application.id} className={`${application.status === Status.REJECTED ? 'bg-red-800' : 'bg-gray-100'} border p-3 rounded-md hover:border-blue-era transition-all duration-100 mb-2`}>
                <header>
                  <h4 className='font-bold'>{application.user.fullName}</h4>
                </header>
                <p>{application.user.email}</p>
                <footer>
                  <p className='text-sm font-semibold'>{moment(application.applicationDate).fromNow()}</p>
                </footer>
              </div>
            ))
          }
        </div>
      </div>

      {offer?.closed &&
        <div className='shadow-card-bold rounded-md p-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-xl font-semibold'>Find the best applicant</h3>
            { betterApplicant === null && <Button isLoading={loading} color='primary' onClick={findBetterApplicant}>Find Now!</Button>}
          </div>
          <Divider className='my-2' />
          <p className=''>We will find the best applicant for you</p>
          {
            betterApplicant && (
              <div className='flex flex-col gap-2'>
                <h3 className='font-semibold'>Better Applicant</h3>

                <div className='bg-gray-100 border p-3 rounded-md hover:border-blue-era transition-all duration-100'>
                  <header>
                    <h4 className='font-bold'>{betterApplicant.user.fullName}</h4>
                  </header>
                  <p>{betterApplicant.user.email}</p>
                  <footer>
                    <p className='text-sm font-semibold'>{moment(betterApplicant.applicationDate).fromNow()}</p>
                  </footer>
                </div>
              </div>
            )
          }
        </div>
      }
    </div>
  )
}

export default OfferDetailView
