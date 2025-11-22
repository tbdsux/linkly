import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { category } from '@/lib/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'

export const getUsersCategories = createServerFn().handler(async () => {
  const session = await getSession()
  if (!session) {
    return {
      success: false,
      error: 'Unauthorized',
    }
  }

  const categoryItems = await db
    .select()
    .from(category)
    .where(eq(category.userId, session.user.id))

  return {
    success: true,
    data: categoryItems,
  }
})
