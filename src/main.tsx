import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Root from '@/routes/root.tsx'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import ErrorPage from '@/routes/not-found.tsx'
import Dashboard from '@/routes/dashboard/dashboard.tsx'
import Savings from '@/routes/patrimony/savings/savings.tsx'
import RealEstate from '@/routes/patrimony/real-estate/real-estate.tsx'
import EmployeeSavings from '@/routes/patrimony/employee-savings/employee-savings.tsx'
import Stocks from '@/routes/patrimony/stocks/stocks.tsx'
import AnnuityRealEstate from '@/routes/annuity/real-estate/real-estate.tsx'

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
        children: [
          {
            path: 'savings',
            element: <Savings />,
          },
          {
            path: 'real-estate',
            element: <RealEstate />,
          },
          {
            path: 'stocks',
            element: <Stocks />,
          },
          {
            path: 'employee-savings',
            element: <EmployeeSavings />,
          },
        ],
      },
      {
        path: 'annuity',
        children: [
          {
            path: 'real-estate',
            element: <AnnuityRealEstate />,
          },
        ],
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
