import { RouterProvider } from 'react-router-dom'
import { router } from '@/shared/config/router'

function App () {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
