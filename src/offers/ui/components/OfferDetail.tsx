import { useAuth } from '@/auth/hooks/useAuth'
import Button from '@/shared/ui/components/form/Button'
import Divider from '@/shared/ui/components/utils/Divider'
import { type Offer } from '@/offers/models/offer.interface'
import parse from 'html-react-parser'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { UsersService } from '@/users/services/users.service'
import { Role } from '@/users/models/enum/role.enum'
import { useQuery } from '@tanstack/react-query'
import ApplyModal from './ApplyModal'

interface OfferDetailProps {
  offer: Offer | null
}

const OfferDetail: React.FC<OfferDetailProps> = ({ offer }) => {
  const { user: currentUser } = useAuth()

  const [showApply, toggleShowApply] = useBooleanState()

  const {
    data: user = null
  } = useQuery({
    queryKey: ['user', currentUser?.id],
    queryFn: async () => await new UsersService().findById(currentUser?.id ?? 0),
    enabled: !!currentUser
  })

  return (
    <div className='shadow-card-bold rounded-md p-4 '>
      <header className='flex justify-between gap-2'>
        <div>
          <h2 className='text-xl font-semibold'>{offer?.title}</h2>
          <p>{offer?.location}</p>
        </div>
        <div>
          {user?.role === Role.APPLICANT && <Button color='primary' onClick={toggleShowApply}>Apply</Button>}
        </div>
      </header>

      <Divider className='my-2' />
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

      { offer && user && showApply && <ApplyModal isOpen={showApply} onClose={toggleShowApply} offer={offer} user={user} /> }
      {offer && offer.applications.length > 0 && <p>Postulaciones: {offer?.applications.length}</p>}
    </div>
  )
}

export default OfferDetail
