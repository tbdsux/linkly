import { saveNewLinkFn } from '@/actions/link-actions'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getNonEmptyString } from '@/lib/utils'
import { linkFormSchema } from '@/shared-schema/new-link-schema'
import { Links } from '@/types/links'
import { UrlError, UrlMetadata } from '@/types/url'
import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useDashboardData } from '../dashboard-provider'

export default function ConfirmCreateLink(props: {
  data: UrlMetadata | UrlError
}) {
  const router = useRouter()

  const { user } = useAuth()
  const { categories } = useDashboardData()

  const [isOpen, setIsOpen] = useState(false)

  const [isProcessing, startTransition] = useTransition()

  const form = useForm({
    defaultValues: {
      urlTitle: 'error' in props.data ? '' : props.data.title,
      urlDescription: 'error' in props.data ? '' : props.data.description,
      category: '',
    },
    validators: {
      onSubmit: linkFormSchema,
    },
    onSubmit: ({ value }) => {
      if (value.urlTitle === '') {
        return
      }

      if (!user) return

      const urlData = 'error' in props.data ? null : props.data

      const partialData: Partial<Links> = {
        urlLink:
          'error' in props.data ? props.data.url : props.data.requested_url,
        urlTitle: value.urlTitle,
        urlDescription: value.urlDescription,
        urlFavicon: urlData?.favicon ?? '',
        urlLogo: getNonEmptyString([urlData?.logo, urlData?.image]),
        category: value.category,
      }

      const process = toast.loading('Saving link...')

      startTransition(async () => {
        const res = await saveNewLinkFn({
          data: partialData as Links,
        })

        if (!res.success) {
          toast.error(res.error || 'An error occurred while saving the link.', {
            id: process,
          })
          return
        }

        await router.invalidate()

        startTransition(() => {
          toast.success('Link saved successfully!', { id: process })
          setIsOpen(false)
        })
      })
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Save Link</Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => isProcessing && e.preventDefault()}
        className="max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>Save Link</DialogTitle>
          <DialogDescription>
            Setup your link, add a title and description
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {'error' in props.data ? null : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg inline-flex space-x-2">
                  {props.data.favicon ? (
                    <img
                      src={new URL(
                        props.data.favicon,
                        props.data.url,
                      ).toString()}
                      alt="favicon"
                      className="h-6 w-6 rounded-full"
                    />
                  ) : null}

                  <span>{props.data.title}</span>
                </CardTitle>
                <CardDescription>{props.data.description}</CardDescription>
              </CardHeader>
              <CardContent className="grid">
                <div>
                  <a
                    href={props.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm break-all"
                  >
                    {props.data.url}
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <FieldGroup>
              <form.Field
                name="urlTitle"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Link Title, i.e, Example Website"
                      />

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="urlDescription"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Link description..."
                      />

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="category"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Category</FieldLabel>

                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>

                        <SelectContent position="item-aligned">
                          {/* @ts-expect-error This works lol */}
                          <SelectItem value={null}>None</SelectItem>
                          {categories.map((item) => (
                            <SelectItem key={item.$id} value={item.name}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>

            <div className="text-right">
              <Button disabled={isProcessing} type="submit">
                {isProcessing ? 'Saving...' : 'Save Link'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
