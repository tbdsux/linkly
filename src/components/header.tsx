import logo from '@/assets/logo.png'
import { Link } from '@tanstack/react-router'
import AuthHeaderMenu from './auth-header-menu'
import { ThemeToggle } from './theme-toggle'

export default function Header() {
  return (
    <header className="px-4 lg:px-6 py-6 h-24 flex items-center">
      <Link className="flex items-center justify-center space-x-2" to="/">
        <img src={logo} className="size-8" alt="Linkly" />
        <strong className="font-bold text-lg">Linkly</strong>
      </Link>

      <nav className="ml-auto flex gap-2 sm:gap-6">
        <div className="inline-flex items-center gap-2">
          <ThemeToggle />

          <AuthHeaderMenu />
        </div>
      </nav>
    </header>
  )
}
