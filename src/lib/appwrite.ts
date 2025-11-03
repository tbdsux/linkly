import { useAppSession } from '@/hooks/use-app-session'
import * as sdk from 'node-appwrite'

export const appwriteConfig = {
  domain: process.env.APPWRITE_DOMAIN!,
  projectId: process.env.APPWRITE_PROJECT_ID!,
  databaseId: process.env.APPWRITE_DATABASE_ID!,
  collection: {
    links: process.env.APPWRITE_COLLECTION_STORE!,
    categories: process.env.APPWRITE_COLLECTION_CATEGORIES!,
  },
  apiKey: process.env.APPWRITE_API_KEY!,
}

export const createSessionClient = async () => {
  const client = new sdk.Client()
    .setEndpoint(appwriteConfig.domain)
    .setProject(appwriteConfig.projectId)

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
    get tablesDb() {
      return new sdk.TablesDB(client)
    },
  }
}

export const createAdminClient = () => {
  const client = new sdk.Client()
    .setEndpoint(appwriteConfig.domain)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.apiKey)

  return {
    get account() {
      return new sdk.Account(client)
    },
  }
}
