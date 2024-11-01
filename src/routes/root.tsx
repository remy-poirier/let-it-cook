import { Outlet } from 'react-router-dom'
import AppSidebar from '@/components/app-sidebar.tsx'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.tsx'

export default function Root() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <SidebarProvider>
          <AppSidebar />
          <div className="container">
            <SidebarTrigger />
            <Outlet />
          </div>
        </SidebarProvider>
      </main>
    </div>
  )
}
