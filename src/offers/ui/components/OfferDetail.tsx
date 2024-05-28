import { useAuth } from '@/auth/hooks/useAuth'
import Button from '@/shared/ui/components/form/Button'
import Divider from '@/shared/ui/components/utils/Divider'
import { OffersService } from '@/offers/services/offers.service'
import { useToast } from '@/shared/hooks/useToast'
import { useEffect, useState } from 'react'
import { type Offer } from '@/offers/models/offer.interface'
import { useOffersQuery } from '../hooks/useOffersQuery'
import parse from 'html-react-parser'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import Modal from '@/shared/ui/components/utils/Modal'
import { type PresentationLetter } from '@/users/models/user.interface'
import { UsersService } from '@/users/services/users.service'
import { Role } from '@/users/models/enum/role.enum'

interface OfferDetailProps {
  offer: Offer | null
}

const OfferDetail: React.FC<OfferDetailProps> = ({ offer }) => {
  const { handleUpdateOffer } = useOffersQuery()
  const { user } = useAuth()

  const [canApply, setCanApply] = useState(false)
  const [showApply, toggleShowApply] = useBooleanState()
  const [presentationLetters, setPresentationLetters] = useState<PresentationLetter[]>([])
  const [selectedPresentationLetter, setSelectedPresentationLetter] = useState<PresentationLetter | null>(null)

  const [applying, setApplying] = useState(false)

  useEffect(() => {
    if (!offer || !user) return

    const hasUserApplied = offer.applications.some(application => application.user.id === user.id)

    const canApply = offer.user.id !== user.id && !hasUserApplied && !offer.closed && user.role === Role.APPLICANT
    setCanApply(canApply)
  }, [offer, user])

  useEffect(() => {
    if (!showApply || !user) return

    void new UsersService().findById(user.id)
      .then((response) => {
        setPresentationLetters(response.presentationLetters)
      })
      .catch((error) => {
        const { message } = error.data
        useToast({ message, type: 'error' })
      })
  }, [showApply, user])

  const handleApply = () => {
    if (!offer) return

    setApplying(true)
    void new OffersService()
      .apply(offer.id, {
        letter: selectedPresentationLetter?.content ?? undefined
      })
      .then(async (response) => {
        await handleUpdateOffer(response)
        toggleShowApply()
        useToast({ message: 'Applied successfully', type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        useToast({ message, type: 'error' })
      })
      .finally(() => {
        setApplying(false)
      })
  }

  const handleSelectPresentationLetter = (letter: PresentationLetter) => () => {
    setSelectedPresentationLetter(letter.name === selectedPresentationLetter?.name ? null : letter)
  }

  return (
    <div className='shadow-card-bold rounded-md p-4 '>
      <header className='flex justify-between gap-2'>
        <div>
          <h2 className='text-xl font-semibold'>{offer?.title}</h2>
          <p>{offer?.location}</p>
        </div>
        <div>
          {canApply && <Button color='primary' onClick={toggleShowApply}>Apply</Button>}
        </div>
      </header>

      <Modal isOpen={showApply} onClose={toggleShowApply}>
        <h3 className='font-semibold text-center uppercase'>Apply to {offer?.title}</h3>
        <p className='font-semibold text-center'>Are you sure you want to apply to this offer?</p>

        {presentationLetters.length > 0 && (<>
          <Divider className='my-[2]'></Divider>
          <h3>Do you want to select a letter for this offer?</h3>
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
        </>
        )}

        <div className='flex justify-end gap-2 mt-4'>
          <Button color='danger' onClick={toggleShowApply}>Cancel</Button>
          <Button color='primary' isLoading={applying} onClick={handleApply}>Apply</Button>
        </div>
      </Modal>

      <Divider className='my  -2' />
      <div className='[&>p]:font-semibold [&>p>span]:font-normal'>
        <p>Empresa: <span>{offer?.company}</span></p>
        {String(offer?.salary ?? '').length > 0 && <p>Salario: <span>{offer?.salary}</span></p>}
      </div>

      <div>
        {parse(offer?.description?.replace(/\n/g, '<br>') ?? '')}
      </div>

      {
        offer && offer.expectedAbilities.length > 0 && (
          <div className='my-2'>
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

      {offer && offer.applications.length > 0 && <p>Postulaciones: {offer?.applications.length}</p>}
    </div>
  )
}

export default OfferDetail
