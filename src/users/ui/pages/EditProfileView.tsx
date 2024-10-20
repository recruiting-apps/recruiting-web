import SelectAbilities from '@/offers/ui/components/SelectAbilities'
import { useToast } from '@/shared/hooks/useToast'
import Form from '@/shared/ui/components/form/Form'
import FormGrid from '@/shared/ui/components/form/FormGrid'
import Input from '@/shared/ui/components/form/Input'
import SelectInput from '@/shared/ui/components/form/SelectInput'
import TextEditor from '@/shared/ui/components/form/TextEditor'
import { type Role } from '@/users/models/enum/role.enum'
import { type UserDto, type User } from '@/users/models/user.interface'
import { UsersService } from '@/users/services/users.service'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditProfileView: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  const [description, setDescription] = useState('')
  const [education, setEducation] = useState('')
  const [workExperience, setWorkExperience] = useState('')
  const [abilities, setAbilities] = useState<string[]>([])

  useEffect(() => {
    if (id === undefined) {
      navigate(-1)
      return
    }

    void new UsersService()
      .findById(+id)
      .then((user) => {
        setUser(user)
        setDescription(user.description)
        setEducation(user.education)
        setWorkExperience(user.workExperience)
        setAbilities(user.abilities)
      })
      .catch((error) => {
        console.log(error)
        navigate(-1)
      })
  }, [id])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const userDto: UserDto = {
      name: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: user?.email ?? '',
      password: '',
      role: formData.get('role') as Role,
      phone: formData.get('phone') as string,
      profession: formData.get('profession') as string,
      address: formData.get('address') as string,
      description,
      education,
      workExperience,
      abilities,
      bornDate: new Date(formData.get('bornDate') as string),
      cvPath: user?.cvPath ?? '',
      profileImagePath: user?.profileImagePath ?? '',
      googleAccount: user?.googleAccount ?? false,
      emailNotification: user?.emailNotification ?? false,
      presentationLetters: user?.presentationLetters ?? []
    }

    const userId = id ?? 0
    await new UsersService()
      .update(userDto, +userId)
      .then(() => {
        useToast({ message: 'User updated successfully' })
        setTimeout(() => {
          navigate('/profile/detail')
        }, 2000)
      })
      .catch((error) => {
        console.log(error)
        const { message } = error.data
        useToast({ message, type: 'error' })
      })
  }

  return (
    <div className='mb-6'>
      <h1 className='uppercase font-semibold text-lg mb-4'>Edit Profile</h1>
      <main className='shadow-card p-3 rounded-md'>
        <Form
          className='[&>section>fieldset]:mb-4 [&>section>fieldset]:border-[2px] [&>section>fieldset]:border-gray-200 [&>section>fieldset]:rounded-lg [&>section>fieldset]:p-5'
          onSubmit={(event) => { void onSubmit(event) }}
          submitText='Save changes'
          onCancel={() => { navigate(-1) }}
        >
          <section id='section-1'>
            <fieldset>
              <legend className='text-title text-xl'>Personal Information</legend>

              <FormGrid cols='grid-cols-2'>
                <Input
                  label='First Name'
                  name='firstName'
                  type='text'
                  placeholder='Jhon'
                  value={user?.name}
                />

                <Input
                  label='Last Name'
                  name='lastName'
                  type='text'
                  placeholder='Doe'
                  value={user?.lastName}
                />

                <SelectInput<string>
                  label='Role'
                  name='role'
                  objects={[
                    'recruiter',
                    'applicant'
                  ]}
                  value={user?.role}
                />

              </FormGrid>
            </fieldset>

            <fieldset>
              <legend className='text-title text-xl'>Extra Information</legend>
              <FormGrid cols='grid-cols-3'>
                <Input
                  label='Phone'
                  name='phone'
                  type='text'
                  placeholder='999999999'
                  validations={[{
                    type: 'function',
                    message: 'Phone number must have 9 digits',
                    validate: (value) => value.length === 9
                  }]}
                  value={user?.phone}
                />

                <Input
                  label='Profession'
                  name='profession'
                  type='text'
                  placeholder='Software Engineer'
                  value={user?.profession}
                />

                <Input
                  label='Born Date'
                  name='bornDate'
                  type='date'
                  value={moment(user?.bornDate).format('YYYY-MM-DD')}
                />

              </FormGrid>

              <Input
                label='Address'
                name='address'
                type='text'
                placeholder='Av. Example 123'
                value={user?.address}
              />
            </fieldset>
          </section>
          <section id='section-2'>
            <fieldset>
              <legend className='text-title text-xl'>Tell us more about you</legend>

              <TextEditor
                label='Professional Summary'
                content={description}
                handleChange={(value) => { setDescription(value) }}
              />

              <TextEditor
                label='Education'
                content={education}
                handleChange={(value) => { setEducation(value) }}
              />

              <TextEditor
                label='Work Experience'
                content={workExperience}
                handleChange={(value) => { setWorkExperience(value) }}
              />
            </fieldset>
          </section>

          <section id='section-3'>
            <fieldset>
              <legend className='text-title text-xl'>Abilities</legend>

              <SelectAbilities
                label='Abilities'
                abilities={abilities}
                setAbilities={setAbilities}
              />

            </fieldset>
          </section>

        </Form>
      </main>
    </div>
  )
}

export default EditProfileView
