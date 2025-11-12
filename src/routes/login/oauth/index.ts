import { useAppSession } from '@/hooks/use-app-session'
import { createAdminClient } from '@/lib/appwrite'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login/oauth/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const userId = new URL(request.url).searchParams.get('userId')
        const secret = new URL(request.url).searchParams.get('secret')

        if (!userId || !secret) {
          return new Response('Missing userId or secret', { status: 400 })
        }

        const appSession = await useAppSession()

        const { account } = createAdminClient()
        const session = await account.createSession({
          userId,
          secret,
        })

        await appSession.update({
          sessionSecret: session.secret,
          userId: session.userId,
        })

        return redirect({ to: '/dashboard' })
      },
    },
  },
})
