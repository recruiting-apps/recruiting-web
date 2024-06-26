import GoogleRegisterView from '@/auth/ui/pages/GoogleRegisterView'
import LoginView from '@/auth/ui/pages/LoginView'
import RegisterView from '@/auth/ui/pages/RegisterView'
import EditOfferView from '@/offers/ui/pages/EditOfferView'
import MyApplicationsView from '@/offers/ui/pages/MyApplicationsView'
import MyOffersView from '@/offers/ui/pages/MyOffersView'
import OfferDetailView from '@/offers/ui/pages/OfferDetailView'
import OfferFormView from '@/offers/ui/pages/OfferFormView'
import OffersView from '@/offers/ui/pages/OffersView'
import AuthRequired from '@/shared/ui/components/layout/AuthRequired'
import RoleRequired from '@/shared/ui/components/layout/RoleRequired'
import ErrorPage from '@/shared/ui/pages/ErrorPage'
import HomePage from '@/shared/ui/pages/HomePage'
import NotFoundPage from '@/shared/ui/pages/NotFoundPage'
import { ConfigurationView } from '@/users/ui/pages/ConfigurationView'
import EditProfileView from '@/users/ui/pages/EditProfileView'
import ProfileView from '@/users/ui/pages/ProfileView'
import SearchUsersView from '@/users/ui/pages/SearchUsersView'
import { type RouteObject, createBrowserRouter, Navigate } from 'react-router-dom'

const AUTH_REQUIRED_ROUTES: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to='/offers' />
  },
  {
    path: '/home',
    element: <HomePage />
  },
  {
    path: '/profile',
    children: [
      {
        path: 'detail/:id?',
        element: <ProfileView />
      },
      {
        path: 'configuration',
        element: <ConfigurationView />
      },
      {
        path: 'edit/:id',
        element: <EditProfileView />
      }
    ]
  },
  {
    path: 'applicants-search',
    element: <RoleRequired />,
    children: [
      {
        path: '',
        element: <SearchUsersView />
      }
    ]
  },
  {
    path: '/offers',
    element: <OffersView />
  },
  {
    path: '/my-offers',
    element: <RoleRequired />,
    children: [
      {
        path: '',
        element: <MyOffersView />
      },
      {
        path: ':id',
        element: <OfferDetailView />
      },
      {
        path: 'offer-form',
        element: <OfferFormView offerToEdit={null}/>
      },
      {
        path: 'offer-form-edit/:id',
        element: <EditOfferView />
      }
    ]
  },
  {
    path: 'my-applications',
    element: <MyApplicationsView />
  }
]

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginView />
  },
  {
    path: '/register',
    element: <RegisterView />
  },
  {
    path: '/google-register',
    element: <GoogleRegisterView />
  },
  {
    path: '/',
    element: <AuthRequired />,
    errorElement: <ErrorPage />,
    children: AUTH_REQUIRED_ROUTES

  },
  {
    path: '*',
    element: <NotFoundPage />
  }
])
