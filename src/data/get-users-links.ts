import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { link } from '@/lib/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'

export const getUserLinks = createServerFn().handler(async () => {
  const session = await getSession()
  if (!session) {
    return {
      success: false,
      error: 'Unauthorized',
    }
  }

  const linkItems = await db
    .select()
    .from(link)
    .where(eq(link.userId, session.user.id))
    .orderBy(desc(link.createdAt))
    .execute()

  return {
    success: true,
    data: linkItems,
  }
})
