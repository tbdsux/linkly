import { appwriteConfig, createSessionClient } from '@/lib/appwrite'
import { Category } from '@/types/links'
import { createServerFn } from '@tanstack/react-start'
import { Query } from 'node-appwrite'

export const getUsersCategories = createServerFn()
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const { userId } = data

    const { tablesDb } = await createSessionClient()

    // get user categories
    const links = await tablesDb.listRows<Category>({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.collection.categories,
      queries: [Query.equal('ownerId', userId), Query.orderDesc('$updatedAt')],
    })

    return links
  })
