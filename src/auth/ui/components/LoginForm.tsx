import { useAuth } from '@/auth/hooks/useAuth'
import Form from '@/shared/ui/components/form/Form'
import Input from '@/shared/ui/components/form/Input'
import { useToast } from '@/shared/hooks/useToast'
import { type UserDto, type UserLogin } from '@/users/models/user.interface'
import { useState } from 'react'
import Button from '@/shared/ui/components/form/Button'
import Divider from '@/shared/ui/components/utils/Divider'
import { useNavigate } from 'react-router-dom'
import { handleLoginWithGoogle } from '@/shared/config/firebase/auth'
import { Role } from '@/users/models/enum/role.enum'
import { useLoginUser } from '@/auth/store/login.store'

const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const { updateUser } = useLoginUser(state => state)
  const [loading, setLoading] = useState(false)
  const { login, loginWithGoogle } = useAuth()

  const handleLogin = async (user: UserLogin) => {
    await login(user)
      .catch((error) => {
        console.log(error)
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

  const onLoginWithGoogle = async () => {
    await handleLoginWithGoogle()
      .then(async (user) => {
        const { displayName, email, phoneNumber, photoURL, uid } = user

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
          googleAccount: true,
          emailNotification: true,
          presentationLetters: []
        }

        updateUser(userDto)

        await loginWithGoogle({ email: email ?? '' })
          .then((response) => {
            if (response === null) {
              useToast({ type: 'success', message: 'Bienvenido' })
              navigate('/google-register')
            }
          })
          .catch((error) => {
            const { message } = error.data
            useToast({ type: 'error', message })
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

      <Button color='danger' onClick={() => { void onLoginWithGoogle() }}>Login with Google</Button>

    </Form>
  )
}

export default LoginForm
