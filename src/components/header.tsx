import logo from '@/assets/logo.png'
import { Link } from '@tanstack/react-router'
import AuthHeaderMenu from './auth-header-menu'

export default function Header() {
  return (
    <header className="px-4 lg:px-6 py-6 h-24 flex items-center">
      <Link className="flex items-center justify-center space-x-2" to="/">
        <img src={logo} className="size-8" alt="Linkly" />
        <strong className="font-bold text-lg">Linkly</strong>
      </Link>

      <nav className="ml-auto flex gap-4 sm:gap-6">
        <AuthHeaderMenu />
      </nav>
    </header>
  )
}
