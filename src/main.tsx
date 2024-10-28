import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Root from '@/routes/root.tsx'
import { ThemeProvider } from '@/components/theme-provider.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="letitcook-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
