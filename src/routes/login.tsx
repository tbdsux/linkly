import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    if (context.session) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
})
