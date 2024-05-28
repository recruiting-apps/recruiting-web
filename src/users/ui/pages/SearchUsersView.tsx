import { useToast } from '@/shared/hooks/useToast'
import Button from '@/shared/ui/components/form/Button'
import Input from '@/shared/ui/components/form/Input'
import Divider from '@/shared/ui/components/utils/Divider'
import { type User } from '@/users/models/user.interface'
import { UsersService } from '@/users/services/users.service'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const SearchUsersView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)

  const onSearch = async () => {
    if (searching) return

    if (search.trim().length === 0) return

    setSearching(true)
    await new UsersService()
      .findByAbilities(search)
      .then((response) => {
        setUsers(response)
        const message = response.length > 0 ? 'Users found' : 'No users found'
        useToast({ message, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        useToast({ message, type: 'error' })
      })
      .finally(() => {
        setSearching(false)
      })
  }

  return (
    <div className='mt-5'>
      <h1 className='text-2xl font-semibold uppercase'> Search Applicant
        <span className='ml-2 text-base font-normal lowercase' > Search an applicant by any ability you want</span >
      </h1>

      <Divider></Divider>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          void onSearch()
        }}
        className='w-full'>
        <Input
          className='w-full'
          label='Search by abilities'
          type='text'
          name='search'
          placeholder='Ej. Java, Python, React, etc.'
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
          }}
        >
        </Input>

        <footer className='flex gap-2 items-center'>

          <Button
            type='submit'
            className='mt-2'
            color='primary'
          >
            Search
          </Button>

          <Button
            type='reset'
            className='mt-2'
            color='secondary'
            onClick={() => {
              setSearch('')
              setUsers([])
            }}
          >
            Clean
          </Button>
        </footer>
      </form>

      <ul className='mt-5 grid grid-cols-responsive gap-5'>
        {users.map((user) => (
          <li key={user.id} className='shadow-card p-4 rounded-md mt-5 grid grid-cols-[3fr_1fr]'>
            <div>
              <h3 className='font-semibold'>{user.name} {user.lastName}</h3>
              <p>{user.email}</p>
              <p>{user.phone}</p>

              <Link
                className='block mt-2'
                to={`/profile/detail/${user.id}`}>
                <Button color='primary'>
                  See Profile
                </Button>
              </Link>
            </div>

            <img
            className='w-full max-w-[120px] h-full max-h-[120px] object-cover rounded-full'
            src={user.profileImagePath} alt="user-profile" />

          </li>
        ))}
      </ul>
    </div >
  )
}

export default SearchUsersView
