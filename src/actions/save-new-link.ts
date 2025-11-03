import { appwriteConfig, createSessionClient } from '@/lib/appwrite'
import { authMiddleware } from '@/middleware/auth'
import { createServerFn } from '@tanstack/react-start'
import { ID } from 'node-appwrite'
import z from 'zod'

const inputSchema = z.object({
  ownerId: z.string(),
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
    const { tablesDb } = await createSessionClient()

    try {
      await tablesDb.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.collection.links,
        rowId: ID.unique(),
        data,
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
