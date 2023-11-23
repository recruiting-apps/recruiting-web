import Toast from '@/shared/ui/components/layout/Toast'
import RegisterForm from '../components/RegisterForm'

const RegisterView: React.FC = () => {
  return (
    <div className='h-screen mt-6'>
      <div className='min-w-[600px] max-w-[min(1000px,90%)] mx-auto px-6 py-7 shadow-card-bold rounded-lg'>
        <div className='flex gap-4 items-center justify-center mb-2 pb-3 border-b-[1px] border-b-gray-300'>
          <h1 className='text-title text-2xl uppercase'>Recruiting APP</h1>
        </div>
        <p className='text-center'>Welcome to Recruiting APP!</p>
        <p className='text-center'>Please, fill in the form to register.</p>

        <RegisterForm />
      </div>
      <Toast />
    </div>
  )
}

export default RegisterView
