import { useSession } from '@tanstack/react-start/server'

export type AppSession = {
  sessionSecret?: string
}

export const useAppSession = () => {
  return useSession<AppSession>({
    password: process.env.SECRET_KEY!,
  })
}
