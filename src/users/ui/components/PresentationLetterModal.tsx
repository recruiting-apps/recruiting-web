import { useToast } from '@/shared/hooks/useToast'
import Button from '@/shared/ui/components/form/Button'
import Form from '@/shared/ui/components/form/Form'
import Input from '@/shared/ui/components/form/Input'
import Textarea from '@/shared/ui/components/form/Textarea'
import Divider from '@/shared/ui/components/utils/Divider'
import Modal from '@/shared/ui/components/utils/Modal'
import { type UserDto, type PresentationLetter, type User, userToDto } from '@/users/models/user.interface'
import parse from 'html-react-parser'
import { useState } from 'react'

interface PresentationLetterProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onUserChange: (user: UserDto) => Promise<void>
}

const PresentationLetterModal: React.FC<PresentationLetterProps> = ({ isOpen, onClose, user, onUserChange }) => {
  const [presentationLetter, setPresentationLetter] = useState<PresentationLetter | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const name = formData.get('name') as string
    const content = formData.get('content') as string
    const create = formData.get('create') === 'on'
    const presentationLetters = [...user.presentationLetters]

    console.log({
      name,
      content,
      create
    })

    if (create) {
      presentationLetters.push({ name, content })
    } else {
      const index = presentationLetters.findIndex(letter => letter.name === presentationLetter?.name)
      presentationLetters[index] = { name, content }
    }

    setLoading(true)
    void onUserChange({ ...userToDto(user), presentationLetters })
      .then(() => {
        setShowForm(false)
        setPresentationLetter(null)
        useToast({ type: 'success', message: 'Presentation letter saved successfully' })
      })
      .catch((error) => {
        useToast({ type: 'error', message: error.data.message })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleDelete = (name: string) => () => {
    const presentationLetters = user.presentationLetters.filter(letter => letter.name !== name)
    setLoading(true)
    void onUserChange({ ...userToDto(user), presentationLetters })
      .then(() => {
        useToast({ type: 'success', message: 'Presentation letter deleted successfully' })
      })
      .catch((error) => {
        useToast({ type: 'error', message: error.data.message })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} onTop width='max-w-6xl'>

      <div className='flex justify-between items-center'>
        <h2 className='text-lg text-center font-semibold uppercase'>Presentation Letters</h2>
        <Button color='primary' onClick={() => {
          setShowForm(true)
          setPresentationLetter(null)
        }}>Add +</Button>
      </div>

      {
        showForm && (
          <Form
            isLoading={loading}
            onCancel={() => { setShowForm(false) }}
            onSubmit={onSubmit}>
            <input name='create' type="checkbox" className='hidden' checked={presentationLetter === null} />
            <Input
              type='text'
              label='Presentation Name'
              name='name'
              value={presentationLetter?.name ?? ''}
            />

            <Textarea
              label='Content'
              name='content'
              value={presentationLetter?.content ?? ''}
            ></Textarea>
          </Form>
        )
      }

      <Divider className='mt-2 mb-2'></Divider>
      {
        user?.presentationLetters.length === 0 && (
          <p className='text-center'>No presentation letters found</p>
        )
      }

      {
        user?.presentationLetters.map((letter) => (
          <article key={letter.name} className='bg-gray-100 border-b p-3 rounded-md'>
            <header className='flex justify-between items-center'>
              <h3 className='font-semibold'>Title: {letter.name}</h3>

              {!showForm &&
                <div className='flex gap-2 items-center'>
                  <Button color='primary' onClick={() => {
                    setShowForm(true)
                    setPresentationLetter(letter)
                  }}>Edit</Button>
                  <Button color='danger' onClick={handleDelete(letter.name)}>Remove</Button>
                </div>
              }
            </header>
            <p>{parse(letter.content.replace(/\n/g, '<br>'))}</p>
          </article>
        ))
      }
    </Modal>
  )
}

export default PresentationLetterModal
