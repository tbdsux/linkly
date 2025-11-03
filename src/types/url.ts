export interface UrlMetadata {
  title: string
  description: string
  image: string
  feeds: any[]
  date: string
  lang: string
  logo: string
  favicon: string
  video: string
  keywords: string
  jsonld: string
  url: string
  urlType: string
  cleaned_url?: string
  requested_url: string
}

export interface UrlError {
  error: string
  url: string
}
