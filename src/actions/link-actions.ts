import {
  removeLinkFormSchema,
  updateLinkFormSchema,
} from '@/form-schema/new-link-schema'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { category, link } from '@/lib/db/schema'
import { authMiddleware } from '@/middleware/auth'
import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
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
    const session = await getSession()
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    try {
      const id = nanoid()

      await db.insert(link).values({
        id,
        ...data,
        userId: session.user.id,
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
    const session = await getSession()
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    try {
      // ::> Verify link ownership before deletion
      const linkItem = await db
        .select()
        .from(link)
        .where(and(eq(link.id, data.id), eq(link.userId, session.user.id)))
        .execute()
      if (linkItem.length === 0) {
        throw new Error('Unauthorized to delete this link')
      }
      if (linkItem[0].userId !== session.user.id) {
        throw new Error('Unauthorized to delete this link')
      }

      await db
        .delete(link)
        .where(and(eq(link.id, data.id), eq(link.userId, session.user.id)))
        .execute()

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
    const session = await getSession()
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    try {
      // ::> Verify link ownership before update
      const linkItem = await db
        .select()
        .from(link)
        .where(and(eq(link.id, data.id), eq(link.userId, session.user.id)))
        .execute()
      if (linkItem.length === 0) {
        throw new Error('Unauthorized to update this link')
      }
      if (linkItem[0].userId !== session.user.id) {
        throw new Error('Unauthorized to update this link')
      }

      // ::> Check if category is legit
      const userCategories = await db
        .select()
        .from(category)
        .where(eq(category.userId, session.user.id))
        .execute()
      const categoryExists = userCategories.some(
        (cat) => cat.name === data.category,
      )
      if (!categoryExists) {
        throw new Error('Category does not exist')
      }

      await db
        .update(link)
        .set({
          urlTitle: data.urlTitle,
          urlDescription: data.urlDescription,
          category: data.category,
        })
        .where(and(eq(link.id, data.id), eq(link.userId, session.user.id)))
        .execute()

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
