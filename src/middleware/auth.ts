import { useAppSession } from '@/hooks/use-app-session'
import { createMiddleware } from '@tanstack/react-start'

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const session = await useAppSession()

    if (!session.data.sessionSecret) {
      // TODO:
    }

    return next()
  },
)
