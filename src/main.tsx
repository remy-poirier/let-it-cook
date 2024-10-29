import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Root from '@/routes/root.tsx'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import ErrorPage from '@/routes/not-found.tsx'
import Investments from '@/routes/investments/investments.tsx'
import Dividends from '@/routes/dividends/dividends.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'investments',
        element: <Investments />,
      },
      {
        path: 'dividends',
        element: <Dividends />,
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
