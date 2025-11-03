import { useAppSession } from '@/hooks/use-app-session'
import * as sdk from 'node-appwrite'

export const createSessionClient = async () => {
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_DOMAIN!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)

  const session = await useAppSession()
  if (!session.data.sessionSecret) {
    throw new Error('No session found')
  }

  client.setSession(session.data.sessionSecret)

  return {
    get account() {
      return new sdk.Account(client)
    },
    get databases() {
      return new sdk.Databases(client)
    },
    get avatars() {
      return new sdk.Avatars(client)
    },
  }
}

export const createAdminClient = () => {
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_DOMAIN!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!)

  return {
    get account() {
      return new sdk.Account(client)
    },
  }
}
