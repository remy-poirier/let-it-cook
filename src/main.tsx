import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Root from '@/routes/root.tsx'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import ErrorPage from '@/routes/not-found.tsx'
import Dashboard from '@/routes/dashboard/dashboard.tsx'
import Patrimony from '@/routes/patrimony/patrimony.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'patrimony',
        element: <Patrimony />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="letitcook-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
