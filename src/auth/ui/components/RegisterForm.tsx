import SelectAbilities from '@/offers/ui/components/SelectAbilities'
import Form from '@/shared/ui/components/form/Form'
import FormGrid from '@/shared/ui/components/form/FormGrid'
import Input from '@/shared/ui/components/form/Input'
import SelectInput from '@/shared/ui/components/form/SelectInput'
import TextEditor from '@/shared/ui/components/form/TextEditor'
import { useEffect, useRef, useState } from 'react'
import UploadProfileImage from './UploadProfileImage'
import UploadCvPdf from './UploadCvPdf'
import Button from '@/shared/ui/components/form/Button'
import { type UserDto } from '@/users/models/user.interface'
import { Role } from '@/users/models/enum/role.enum'
import { uploadFile } from '@/shared/config/firebase/storage'
import { useToast } from '@/shared/hooks/useToast'
import { useNavigate } from 'react-router-dom'
import { AuthServices } from '@/auth/services/auth.service'

const RegisterForm: React.FC = () => {
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)
  const [currentSection, setCurrentSection] = useState(1)

  const [role, setRole] = useState<Role>(Role.APPLICANT)
  const [description, setDescription] = useState('')
  const [education, setEducation] = useState('')
  const [workExperience, setWorkExperience] = useState('')
  const [abilities, setAbilities] = useState<string[]>([])

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    hiddenSections(1)
  }, [formRef])

  const hiddenSections = (numSection: number) => {
    const form = formRef.current

    if (!form) return

    const sections = form.querySelectorAll('section')

    if (!sections) return

    sections.forEach(section => {
      if (section.id.includes(String(numSection))) {
        section.classList.remove('hidden')
        return
      }

      section.classList.add('hidden')
    })
  }

  const handleChangeSection = () => {
    const newSectionIndex = currentSection + 1 > 3 ? 3 : currentSection + 1

    hiddenSections(newSectionIndex)
    setCurrentSection(newSectionIndex)
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (currentSection !== 3) {
      handleChangeSection()
      return
    }

    setLoading(true)

    const form = event.currentTarget
    const formData = new FormData(form)

    const userDto: UserDto = {
      name: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role: formData.get('role') as Role,
      phone: formData.get('phone') as string,
      profession: formData.get('profession') as string,
      address: formData.get('address') as string,
      description,
      education,
      workExperience,
      abilities,
      bornDate: new Date(formData.get('bornDate') as string),
      cvPath: '',
      profileImagePath: '',
      googleAccount: false,
      emailNotification: true,
      presentationLetters: []
    }

    if (!imageFile) {
      useToast({ message: 'You must upload your profile image', type: 'error' })
      return
    }

    await Promise.all([
      uploadFile(imageFile, 'profile-images'),
      cvFile && uploadFile(cvFile, 'cv')
    ]).then(async (response) => {
      const [profileImage, cv] = response

      userDto.profileImagePath = profileImage.url
      userDto.cvPath = cv ? cv.url : ''

      await new AuthServices()
        .register(userDto)
        .then(() => {
          useToast({ message: 'User created successfully' })
          setTimeout(() => {
            navigate('/login')
          }, 2000)
        })
        .catch((error) => {
          console.log(error)
          const { message } = error.data
          useToast({ message, type: 'error' })
        })
    })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Form
      ref={formRef}
      className='[&>section>fieldset]:mb-4 [&>section>fieldset]:border-[2px] [&>section>fieldset]:border-gray-200 [&>section>fieldset]:rounded-lg [&>section>fieldset]:p-5'
      onSubmit={(event) => { void onSubmit(event) }}
      hasCancelButton={false}
      showButtons={false}
    >

      <section id='section-1'>
        <fieldset>
          <legend className='text-title text-xl'>Personal Data</legend>
          <FormGrid cols='grid-cols-2'>
            <Input
              label='Email'
              name='email'
              type='text'
              placeholder='example@example.com'
              validations={[
                {
                  type: 'regex',
                  regex: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  message: 'Invalid Email'
                }
              ]}
            />

            <Input
              label='Password'
              name='password'
              type='password'
              placeholder='********'
            />
          </FormGrid>

          <FormGrid cols='grid-cols-2'>
            <Input
              label='First Name'
              name='firstName'
              type='text'
              placeholder='Jhon'
            />

            <Input
              label='Last Name'
              name='lastName'
              type='text'
              placeholder='Doe'
            />

            <SelectInput<string>
              label='Role'
              name='role'
              value={role}
              objects={[
                Role.APPLICANT,
                Role.RECRUITER
              ]}
              onChange={(value) => {
                setRole(value as Role)
              }}
            />

            <UploadProfileImage
              setImageFile={setImageFile}
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
            />

            <Input
              label='Profession'
              name='profession'
              type='text'
              placeholder='Software Engineer'
            />

            <Input
              label='Born Date'
              name='bornDate'
              type='date'
            />

          </FormGrid>

          <Input
            label='Address'
            name='address'
            type='text'
            placeholder='Av. Example 123'
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

          <div className='mt-4'>
            <label className='block mb-2'>Upload your CV</label>
            <UploadCvPdf
              file={cvFile}
              setCvFile={(file) => { setCvFile(file) }}
            />
          </div>

        </fieldset>
      </section>

      <div className='flex justify-end gap-3'>
        {
          currentSection !== 1 && (
            <Button
              color='secondary'
              className='w-[150px]'
              onClick={() => {
                const newSectionIndex = currentSection - 1 < 1 ? 1 : currentSection - 1

                hiddenSections(newSectionIndex)
                setCurrentSection(newSectionIndex)
              }}
            >Back</Button>
          )
        }
        <Button
          color='primary'
          type='submit'
          className='w-[150px]'
          isLoading={loading && currentSection === 3}
        >{ currentSection !== 3 ? 'Next' : 'Submit' }</Button>
      </div>
    </Form>
  )
}

export default RegisterForm
