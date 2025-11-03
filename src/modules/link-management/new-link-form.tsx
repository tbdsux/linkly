import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { fetchUrlMetadata } from '@/data/fetch-url-metadata'
import { UrlError, UrlMetadata } from '@/types/url'
import { useForm } from '@tanstack/react-form'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import z from 'zod'
import ConfirmCreateLink from './confirm-create-link'

const formSchema = z.object({
  urlLink: z.url(),
})

export default function NewLinkForm() {
  const [isProcessing, startTransition] = useTransition()
  const [urlData, setUrlData] = useState<UrlMetadata | UrlError | null>(null)

  const form = useForm({
    defaultValues: {
      urlLink: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const { urlLink } = value

      const process = toast.loading('Fetching URL metadata...')

      startTransition(async () => {
        const res = await fetchUrlMetadata({ data: { url: urlLink } })

        if (!res.success) {
          toast.error('Failed to fetch URL metadata.', { id: process })
          return
        }

        setUrlData(res.data)
        toast.success('URL metadata fetched successfully!', { id: process })
      })
    },
  })

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <FieldGroup>
          <form.Field
            name="urlLink"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Link URL (i.e, https://example.com)</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="i.e, https://example.com"
                  />
                  <FieldDescription>
                    URL metadata (title, description, etc.) will be fetched
                    first.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </FieldGroup>

        <div className="text-right">
          <Button disabled={isProcessing} type="submit">
            {isProcessing ? 'Fetching...' : 'Fetch Metadata'}
          </Button>
        </div>
      </form>

      <div>
        {!isProcessing && urlData ? (
          <>
            {'error' in urlData ? (
              <Card className="border border-red-300">
                <CardHeader>
                  <CardTitle className="text-lg">{urlData.error}</CardTitle>
                  <CardDescription>{urlData.url}</CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="inline-flex items-center space-x-2">
                    {urlData.favicon ? (
                      <img
                        src={new URL(urlData.favicon, urlData.url).toString()}
                        alt="favicon"
                        className="h-6 w-6 rounded-full"
                      />
                    ) : null}

                    <span>{urlData.title}</span>
                  </CardTitle>
                  <CardDescription>{urlData.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid">
                  <div>
                    <a
                      href={urlData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm break-all"
                    >
                      {urlData.requested_url}
                    </a>
                  </div>

                  <div className="mt-6">
                    <ConfirmCreateLink data={urlData} />
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}
