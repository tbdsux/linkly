import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { category } from '@/lib/db/schema'
import { authMiddleware } from '@/middleware/auth'
import { createServerFn } from '@tanstack/react-start'
import { nanoid } from 'nanoid'
import z from 'zod'

const inputSchema = z.object({
  name: z.string().min(3, { error: 'Category name length should be > 3' }),
})

export const createCategoryFn = createServerFn({ method: 'POST' })
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

      await db
        .insert(category)
        .values({
          id,
          name: data.name,
          slug: data.name.toLowerCase().replaceAll(' ', '-').trim(),
          userId: session.user.id,
        })
        .execute()

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
