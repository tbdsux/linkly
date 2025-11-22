import { auth } from '@/lib/auth'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

export const getUserSessionFn = createServerFn().handler(async () => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  })

  return session
})
