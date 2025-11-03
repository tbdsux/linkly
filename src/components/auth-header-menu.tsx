import { logoutFn } from '@/lib/auth'
import { Link, useLocation } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { LogOutIcon } from 'lucide-react'
import { useAuth } from './auth-provider'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export default function AuthHeaderMenu() {
  const logoutAction = useServerFn(logoutFn)

  const { user, avatar } = useAuth()
  const { pathname } = useLocation()

  if (!user) {
    return (
      <Button variant={'outline'} asChild>
        <Link to="/login">Login</Link>
      </Button>
    )
  }

  if (!pathname.startsWith('/dashboard')) {
    return (
      <Button asChild>
        <Link to="/dashboard">Dashboard</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'outline'}
          className="inline-flex items-center space-x-2"
        >
          {avatar ? (
            <img
              src={`data:image/png;base64,${avatar}`}
              alt={user.name}
              height={25}
              width={25}
              className="rounded-full"
            />
          ) : (
            <div className="bg-neutral-300 h-[25px] w-[25px] rounded-full"></div>
          )}

          <span>{user.name}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem
          onSelect={async () => {
            await logoutAction()
          }}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
