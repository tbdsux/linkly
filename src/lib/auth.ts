import { useAppSession } from '@/hooks/use-app-session'
import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createSessionClient } from './appwrite'
import { db } from './db'

export const getLoggedInUserFn = createServerFn().handler(async () => {
  const session = await useAppSession()
  if (!session.data.sessionSecret) {
    return {
      user: null,
      avatar: null,
    }
  }

  try {
    const { account, avatars } = await createSessionClient()
    const user = await account.get()
    const avatarBuffer = await avatars.getInitials(user.name)
    const avatar = Buffer.from(avatarBuffer).toString('base64')

    return {
      user,
      avatar,
    }
  } catch (error) {
    console.error(error)

    return {
      user: null,
      avatar: null,
    }
  }
})

export const logoutFn = createServerFn().handler(async () => {
  const session = await useAppSession()
  if (!session.data.sessionSecret) {
    return
  }

  const { account } = await createSessionClient()
  await account.deleteSession({ sessionId: 'current' })

  await session.clear()

  throw redirect({
    to: '/login',
  })
})

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {},
})
