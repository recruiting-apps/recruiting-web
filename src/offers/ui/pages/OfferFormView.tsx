import Form from '@/shared/ui/components/form/Form'
import FormGrid from '@/shared/ui/components/form/FormGrid'
import Input from '@/shared/ui/components/form/Input'
import TextEditor from '@/shared/ui/components/form/TextEditor'
import { useEffect, useState } from 'react'
import SelectAbilities from '../components/SelectAbilities'
import { type Offer, type OfferDto } from '@/offers/models/offer.interface'
import moment from 'moment'
import { OffersService } from '@/offers/services/offers.service'
import { useToast } from '@/shared/hooks/useToast'
import { useNavigate } from 'react-router-dom'
import { type FormAction } from '@/shared/types'

interface OfferFormViewProps {
  offerToEdit: Offer | null
}

const OfferFormView: React.FC<OfferFormViewProps> = ({ offerToEdit }) => {
  const navigate = useNavigate()
  const [description, setDescription] = useState('')
  const [expectedAbilities, setExpectedAbilities] = useState<string[]>([])

  const [action, setAction] = useState<FormAction>('add')

  useEffect(() => {
    if (!offerToEdit) return

    setDescription(offerToEdit.description)
    setExpectedAbilities(offerToEdit.expectedAbilities)
    setAction('update')
  }, [offerToEdit])

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (description.length === 0) {
      useToast({ message: 'You must enter a description', type: 'error' })
      return
    }

    if (expectedAbilities.length === 0) {
      useToast({ message: 'You must select at least one ability', type: 'error' })
      return
    }

    const form = event.currentTarget

    const formData = new FormData(form)

    const offer: OfferDto = {
      company: formData.get('company') as string,
      description,
      expectedAbilities,
      expirationDate: formData.get('expirationDate') as string,
      location: formData.get('location') as string,
      publicationDate: moment().format('YYYY-MM-DD'),
      salary: formData.get('salary') as string,
      title: formData.get('title') as string,
      closed: false
    }

    const offerService = new OffersService()

    const actionFunc = action === 'add' ? offerService.create : offerService.update

    void actionFunc(offer, offerToEdit?.id ?? '')
      .then(() => {
        useToast({ message: `Offer ${action === 'add' ? 'created' : 'updated'} successfully` })

        const url = action === 'add' ? '/my-offers' : `/my-offers/${offerToEdit?.id}`
        navigate(url)
      })
      .catch((error) => {
        const { message } = error.data
        useToast({ message, type: 'error' })
      })
  }

  return (
    <div>
      <h1 className='uppercase font-semibold text-lg mb-4'>{ action === 'add' ? 'Create a new' : 'Edit'} Job Offer</h1>

      <main className='shadow-card p-3 rounded-md'>
        <Form
          onSubmit={onSubmit}
          submitText={action === 'add' ? 'Create Offer' : 'Save changes'}
          onCancel={() => { navigate('/my-offers') }}
        >
          <Input
            name='title'
            label='Title'
            placeholder='Title'
            type='text'
            value={offerToEdit?.title}
          />

          <FormGrid cols='grid-cols-4'>
            <Input
              name='company'
              label='Company'
              placeholder='Company'
              type='text'
              value={offerToEdit?.company}
            />

            <Input
              name='location'
              label='Location'
              placeholder='Location'
              type='text'
              value={offerToEdit?.location}
            />

            <Input
              name='salary'
              label='Salary'
              placeholder='S/. | $  0.00'
              type='text'
              required={false}
              value={String(offerToEdit?.salary ?? '')}
            />

            <Input
              name='expirationDate'
              label='Expiration Date'
              placeholder='Expiration Date'
              type='date'
              value={offerToEdit?.expirationDate}
            />
          </FormGrid>

          <TextEditor
            label='Description'
            content={description}
            handleChange={(value) => { setDescription(value) }}
          />

          <SelectAbilities
            label='Expected Abilities'
            abilities={expectedAbilities}
            setAbilities={setExpectedAbilities}
          />

        </Form>
      </main>
    </div>
  )
}

export default OfferFormView
