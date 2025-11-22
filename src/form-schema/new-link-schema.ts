import z from 'zod'

export const linkFormSchema = z.object({
  urlTitle: z.string(),
  urlDescription: z.string(),
  category: z.string(),
})

export const updateLinkFormSchema = linkFormSchema.extend({
  id: z.string(),
})

export const removeLinkFormSchema = z.object({
  id: z.string(),
})
