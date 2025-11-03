import { appwriteConfig, createSessionClient } from '@/lib/appwrite'
import { authMiddleware } from '@/middleware/auth'
import {
  removeLinkFormSchema,
  updateLinkFormSchema,
} from '@/shared-schema/new-link-schema'
import { Category, Links } from '@/types/links'
import { createServerFn } from '@tanstack/react-start'
import { ID, Query } from 'node-appwrite'
import z from 'zod'

const inputSchema = z.object({
  isFavorite: z.boolean().optional(),
  urlLink: z.string(),
  urlTitle: z.string(),
  urlDescription: z.string().optional(),
  urlLogo: z.string().optional(),
  urlFavicon: z.string(),
  category: z.string().optional(),
})

export const saveNewLinkFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(inputSchema)
  .handler(async ({ data }) => {
    const { tablesDb, account } = await createSessionClient()
    const user = await account.get()

    try {
      await tablesDb.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.collection.links,
        rowId: ID.unique(),
        data: {
          ...data,
          ownerId: user.$id,
        },
      })

      return {
        success: true,
      }
    } catch (err) {
      console.error('Error saving new link:', err)
      return {
        success: false,
        error: 'Failed to save the new link.',
      }
    }
  })

export const removeLinkFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(removeLinkFormSchema)
  .handler(async ({ data }) => {
    const { tablesDb, account } = await createSessionClient()
    const user = await account.get()

    try {
      // ::> Verify link ownership before deletion
      const link = await tablesDb.getRow<Links>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.collection.links,
        rowId: data.id,
      })
      if (link.ownerId !== user.$id) {
        throw new Error('Unauthorized to delete this link')
      }

      await tablesDb.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.collection.links,
        rowId: data.id,
      })

      return {
        success: true,
      }
    } catch (err) {
      console.error('Error removing link:', err)

      return {
        success: false,
        error:
          err instanceof Error ? err.message : 'Failed to remove the link.',
      }
    }
  })

export const updateLinkFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(updateLinkFormSchema)
  .handler(async ({ data }) => {
    const { tablesDb, account } = await createSessionClient()
    const user = await account.get()

    try {
      // ::> Verify link ownership before deletion
      const link = await tablesDb.getRow<Links>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.collection.links,
        rowId: data.id,
      })
      if (link.ownerId !== user.$id) {
        throw new Error('Unauthorized to delete this link')
      }

      // ::> Check if category is legit
      const userCategories = await tablesDb.listRows<Category>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.collection.categories,
        queries: [Query.equal('ownerId', user.$id)],
      })
      const categoryExists = userCategories.rows.some(
        (cat) => cat.name === data.category,
      )
      if (!categoryExists) {
        throw new Error('Category does not exist')
      }

      await tablesDb.updateRow<Links>({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.collection.links,
        rowId: data.id,
        data: {
          urlTitle: data.urlTitle,
          urlDescription: data.urlDescription,
          category: data.category,
        },
      })

      return {
        success: true,
      }
    } catch (err) {
      console.error('Error updating link:', err)
      return {
        success: false,
        error:
          err instanceof Error ? err.message : 'Failed to update the link.',
      }
    }
  })
