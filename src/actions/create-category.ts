import { appwriteConfig, createSessionClient } from '@/lib/appwrite'
import { authMiddleware } from '@/middleware/auth'
import { createServerFn } from '@tanstack/react-start'
import { ID, Query } from 'node-appwrite'
import z from 'zod'

const inputSchema = z.object({
  name: z.string().min(3, { error: 'Category name length should be > 3' }),
})

export const createCategoryFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(inputSchema)
  .handler(async ({ data }) => {
    const { tablesDb, account } = await createSessionClient()

    const user = await account.get()

    try {
      // Check if category with the same name already exists for the user
      const existingCategories = await tablesDb.listRows({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.collection.categories,
        queries: [
          Query.equal('ownerId', user.$id),
          Query.equal('name', data.name),
        ],
      })

      if (existingCategories.total > 0) {
        throw new Error('Category with this name already exists.')
      }

      await tablesDb.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.collection.categories,
        rowId: ID.unique(),
        data: {
          ownerId: user.$id,
          name: data.name,
        },
      })

      return {
        success: true,
      }
    } catch (err) {
      console.error('Error saving new link:', err)

      return {
        success: false,
        error:
          err instanceof Error ? err.message : 'Failed to create the category.',
      }
    }
  })
