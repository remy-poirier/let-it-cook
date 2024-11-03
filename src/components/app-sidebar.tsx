import {
  Sidebar,
  SidebarContent, SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from '@/components/ui/sidebar.tsx'
import { Activity, Building, ChevronUp, HandCoins, Home, Moon, PiggyBank, Sun, User2 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  DropdownMenu, DropdownMenuCheckboxItem,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Theme, useTheme } from '@/components/theme-provider.tsx'

const items = [
  {
    title: 'Tableau de bord',
    url: '/',
    icon: Home,
  },
]

const patrimonyItems = [
  {
    title: 'Livrets',
    url: '/patrimony/savings',
    icon: PiggyBank,
  },
  {
    title: 'Immobilier',
    url: '/patrimony/real-estate',
    icon: Building,
  },
  {
    title: 'Actifs',
    url: '/patrimony/stocks',
    icon: Activity,
  },
  {
    title: 'Épargne salariale',
    url: '/patrimony/employee-savings',
    icon: HandCoins,
  },
]

const annuityItems = [
  {
    title: 'Immobilier',
    url: '/annuity/real-estate',
    icon: Building,
  },
]

export default function AppSidebar() {
  const { setTheme, theme } = useTheme()
  const location = useLocation()

  const updateTheme = (theme: Theme) => () => {
    setTheme(theme)
  }

  const isActive = (url: string) => location.pathname === url

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={isActive(item.url)} asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Patrimoine</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {patrimonyItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={isActive(item.url)} asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Rentes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {annuityItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={isActive(item.url)} asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  {' '}
                  Rémy Poirier
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuLabel>Thème</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={theme === 'light'}
                  onCheckedChange={updateTheme('light')}
                >
                  <Button variant="ghost" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                  </Button>
                  Clair
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={theme === 'dark'}
                  onCheckedChange={updateTheme('dark')}
                >
                  <Button variant="ghost" size="icon">
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-1 transition-all" />
                  </Button>
                  Sombre
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Gestion</DropdownMenuLabel>
                <DropdownMenuItem>
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
