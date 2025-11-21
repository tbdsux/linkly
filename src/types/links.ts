import { category, link } from '@/lib/db/schema'
import { InferSelectModel } from 'drizzle-orm'

export type Category = InferSelectModel<typeof category>

export type Link = InferSelectModel<typeof link>
