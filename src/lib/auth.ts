import * as authSchema from '@/lib/db/schema/auth'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { reactStartCookies } from 'better-auth/react-start'
import { db } from './db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...authSchema,
    },
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [reactStartCookies()],
})

export const getSession = () => {
  return auth.api.getSession({
    headers: getRequestHeaders(),
  })
}
