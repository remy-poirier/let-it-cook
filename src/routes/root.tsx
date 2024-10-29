import { Outlet } from 'react-router-dom'
import { ModeToggle } from '@/components/mode-toggle.tsx'

export default function Root() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full backdrop-blur">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <a href="/" className="mr-4 flex items-center space-x-2">
              <span className="font-bold lg:inline-block">LetItCook</span>
            </a>
            <nav className="flex items-center gap-4 text-sm lg:gap-6">
              <a href="/investments" className="transition-colors hover:text-foreground/80 text-foreground/60">Investissements</a>
              <a href="/dividends" className="transition-colors hover:text-foreground/80 text-foreground/60">Dividendes</a>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            {/* TODO add cmd+k search here */}
            <nav className="flex items-center">
              <ModeToggle />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
