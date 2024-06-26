import Divider from '@/shared/ui/components/utils/Divider'
import Button from '@/shared/ui/components/form/Button'
import { useNavigate } from 'react-router-dom'
import MyOffersList from '../components/MyOffersList'

const MyOffersView: React.FC = () => {
  const navigate = useNavigate()

  const handleClickCreateOffer = () => {
    navigate('/my-offers/offer-form')
  }

  return (
    <>
      <div className='flex justify-between items-center'>
        <h1 className='uppercase text-3xl font-semibold'>My offers</h1>
        <Button color='primary' onClick={handleClickCreateOffer}>Create new offer</Button>
      </div>

      <Divider className='my-2'></Divider>

      <main className='grid gap-2 grid-cols-[repeat(auto-fill,minmax(400px,1fr))] mt-4'>
        <MyOffersList />
      </main>
    </>
  )
}

export default MyOffersView
