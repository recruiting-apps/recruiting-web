import { useAuth } from '@/auth/hooks/useAuth'
import { AuthServices } from '@/auth/services/auth.service'
import { useLoginUser } from '@/auth/store/login.store'
import SelectAbilities from '@/offers/ui/components/SelectAbilities'
import { useToast } from '@/shared/hooks/useToast'
import Form from '@/shared/ui/components/form/Form'
import Input from '@/shared/ui/components/form/Input'
import SelectInput from '@/shared/ui/components/form/SelectInput'
import Toast from '@/shared/ui/components/layout/Toast'
import { Role } from '@/users/models/enum/role.enum'
import { type UserDto } from '@/users/models/user.interface'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GoogleRegisterView: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { user } = useLoginUser()
  const [role, setRole] = useState<Role>(Role.APPLICANT)
  const [abilities, setAbilities] = useState<string[]>([])
  const [registering, setRegistering] = useState(false)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return

    setRegistering(true)
    const dataForm = new FormData(event.currentTarget)

    const profession = dataForm.get('profession') as string

    const dto: UserDto = {
      ...user,
      role,
      profession,
      abilities
    }

    void new AuthServices()
      .register(dto)
      .then(async () => {
        await login({ email: user.email, password: user.password })
          .then(() => {
            navigate('/profile/detail')
          })
        useToast({ type: 'success', message: 'Registration completed! Welcome!' })
      })
      .catch((error) => {
        useToast({ type: 'error', message: error.data.message })
      })
      .finally(() => {
        setRegistering(false)
      })
  }

  return (
    <div className='h-screen grid place-items-center'>
      <div className='w-full max-w-[800px] px-6 py-7 shadow-card-bold rounded-lg'>
        <div className='flex gap-4 items-center justify-center mb-4 pb-3 border-b-[1px] border-b-gray-300'>
          <h1 className='text-title text-2xl'>Recruiting APP</h1>
        </div>
        <div className='text-center'>
          <p>Hi {user?.name} {user?.lastName},</p>
          <p className='mb-2'>Please, fill in the form to register.</p>
        </div>

        <Form
          submitText='Register'
          hasCancelButton={false}
          onSubmit={onSubmit}
          isLoading={registering}
        >
          <SelectInput<string>
            label='Role'
            name='role'
            value={role}
            objects={[
              'recruiter',
              'applicant'
            ]}
            onChange={(value) => { setRole(value as Role) }}
          />

          <Input
            label='Profession'
            name='profession'
            type='text'
            placeholder='Software Engineer'
          />

          <SelectAbilities
            label='Abilities'
            abilities={abilities}
            setAbilities={setAbilities}
          />

        </Form>
      </div>
      <Toast />
    </div>
  )
}

export default GoogleRegisterView
