import { appwriteConfig, createSessionClient } from '@/lib/appwrite'
import { authMiddleware } from '@/middleware/auth'
import { createServerFn } from '@tanstack/react-start'
import { ID } from 'node-appwrite'
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
