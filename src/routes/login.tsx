import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
})
