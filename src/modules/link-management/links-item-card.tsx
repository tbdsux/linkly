import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Links } from '@/types/links'

export default function LinksItemCard(props: { link: Links }) {
  const { link } = props

  return (
    <Card>
      <CardHeader>
        <CardTitle className="inline-flex items-center space-x-2 truncate">
          {link.urlFavicon ? (
            <img
              src={new URL(link.urlFavicon, link.urlLink).toString()}
              alt="favicon"
              className="h-6 w-6 rounded-full border"
            />
          ) : null}

          <span className="truncate">{link.urlTitle}</span>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {link.urlDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-2">
        <div>
          <a
            href={link.urlLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 dark:text-blue-400 text-sm break-all"
          >
            {link.urlLink}
          </a>
        </div>

        <div className="">
          {link.category ? (
            <Badge>{link.category}</Badge>
          ) : (
            <Badge variant={'outline'}>Uncategorized</Badge>
          )}

          {link.$updatedAt > link.$createdAt ? (
            <p className="text-right mt-2">
              <small className="text-muted-foreground">
                Updated:{' '}
                <strong>{new Date(link.$createdAt).toLocaleString()}</strong>
              </small>
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
