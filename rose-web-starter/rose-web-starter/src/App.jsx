import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PublicLayout from './components/PublicLayout'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import ReservationsPage from './pages/ReservationsPage'
import LocationPage from './pages/LocationPage'
import ExperiencesPage from './pages/ExperiencesPage'
import ContactPage from './pages/ContactPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'reservas', element: <ReservationsPage /> },
      { path: 'ubicacion', element: <LocationPage /> },
      { path: 'experiencias', element: <ExperiencesPage /> },
      { path: 'contacto', element: <ContactPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
