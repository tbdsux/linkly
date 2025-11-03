import { UrlError, UrlMetadata } from '@/types/url'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

export const fetchUrlMetadata = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      url: z.url(),
    }),
  )
  .handler(async ({ data }) => {
    const { url } = data

    const apiUrl = new URL(process.env.SCRAPER_API!)
    apiUrl.searchParams.set('url', url)

    const res = await fetch(apiUrl)
    if (!res.ok) {
      return {
        success: false,
      }
    }

    const metaData = (await res.json()) as UrlMetadata | UrlError
    return {
      success: true,
      data: metaData,
    }
  })
