import { useAuth } from '@/auth/hooks/useAuth'
import Form from '@/shared/ui/components/form/Form'
import Input from '@/shared/ui/components/form/Input'
import { useToast } from '@/shared/hooks/useToast'
import { type UserDto, type UserLogin } from '@/users/models/user.interface'
import { useState } from 'react'
import Button from '@/shared/ui/components/form/Button'
import Divider from '@/shared/ui/components/utils/Divider'
import { useNavigate } from 'react-router-dom'
import { loginWithGoogle } from '@/shared/config/firebase/auth'
import { Role } from '@/users/models/enum/role.enum'
import { UsersService } from '@/users/services/users.service'

const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleLogin = async (user: UserLogin) => {
    await login(user)
      .catch((error) => {
        const { message } = error.data
        useToast({ type: 'error', message })
      })
      .finally(() => { setLoading(false) })
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const user: UserLogin = {
      email,
      password
    }

    setLoading(true)
    void handleLogin(user)
  }

  const handleRegister = () => {
    navigate('/register')
  }

  const handleLoginWithGoogle = async () => {
    await loginWithGoogle()
      .then(async (user) => {
        const { displayName, email, phoneNumber, photoURL, uid } = user

        const existingUser = await new UsersService().findByEmail(email ?? '')

        if (existingUser) {
          await handleLogin({ email: existingUser.email, password: uid })
          return
        }

        const displayNameSplit = displayName?.split(' ') ?? []

        const name = displayNameSplit[0]
        const lastName = displayNameSplit.slice(1).join(' ')

        const userDto: UserDto = {
          name,
          lastName,
          email: email ?? '',
          password: uid,
          abilities: [],
          address: '',
          cvPath: '',
          bornDate: new Date(),
          description: '',
          education: '',
          phone: phoneNumber ?? '',
          profileImagePath: photoURL ?? '',
          profession: '',
          role: Role.APPLICANT,
          workExperience: '',
          googleAccount: true
        }

        await new UsersService()
          .create(userDto)
          .then(async () => {
            await handleLogin({ email: userDto.email, password: userDto.password })
          })
          .catch(() => {
            useToast({ type: 'error', message: 'Hubo un error' })
          })
      })
      .catch((error) => {
        console.log(error)
        useToast({ type: 'error', message: 'Hubo un error' })
      })
  }

  return (

    <Form
      onSubmit={onSubmit}
      submitText="Ingresar"
      hasCancelButton={false}
      buttonClassName='block w-full'
      isLoading={loading}
      showButtons={false}
    >
      <Input
        label='Email'
        name='email'
        type='text'
        placeholder='email@domain.com'
        validations={[
          {
            type: 'regex',
            regex: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            message: 'Email inválido'
          }
        ]}
      />

      <Input
        label='Password'
        name='password'
        type='password'
        placeholder='********'
      />

      <Divider className='my-1'></Divider>

      <Button color='primary' type='submit' isLoading={loading}>Login</Button>
      <Button color='secondary' onClick={handleRegister}>Register</Button>

      <Button color='danger' onClick={() => { void handleLoginWithGoogle() }}>Login with Google</Button>

    </Form>
  )
}

export default LoginForm
