import { appwriteConfig, createSessionClient } from '@/lib/appwrite'
import { Links } from '@/types/links'
import { createServerFn } from '@tanstack/react-start'
import { Query } from 'node-appwrite'

export const getUserLinks = createServerFn()
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const { userId } = data

    const { tablesDb } = await createSessionClient()

    // get user links
    const links = await tablesDb.listRows<Links>({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.collection.links,
      queries: [Query.equal('ownerId', userId), Query.orderDesc('$updatedAt')],
    })

    return links
  })
