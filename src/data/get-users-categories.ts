import { useAppSession } from '@/hooks/use-app-session'
import { appwriteConfig, createSessionClient } from '@/lib/appwrite'
import { Category } from '@/types/links'
import { createServerFn } from '@tanstack/react-start'
import { Query } from 'node-appwrite'

export const getUsersCategories = createServerFn().handler(async () => {
  const session = await useAppSession()
  if (!session.data.userId) {
    throw new Error('User not authenticated')
  }

  const userId = session.data.userId

  const { tablesDb } = await createSessionClient()

  // get user categories
  const links = await tablesDb.listRows<Category>({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.collection.categories,
    queries: [Query.equal('ownerId', userId), Query.orderDesc('$updatedAt')],
  })

  return links
})
