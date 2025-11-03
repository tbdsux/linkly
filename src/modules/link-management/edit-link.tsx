import { updateLinkFn } from '@/actions/link-actions'
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
import { linkFormSchema } from '@/shared-schema/new-link-schema'
import { Links } from '@/types/links'
import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { PenIcon } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { useDashboardData } from '../dashboard-provider'

export default function EditLink(props: { link: Links }) {
  const { user } = useAuth()
  const { categories } = useDashboardData()

  const [isProcessing, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      urlTitle: props.link.urlTitle ?? '',
      urlDescription: props.link.urlDescription ?? '',
      category: props.link.category ?? '',
    },
    validators: {
      onSubmit: linkFormSchema,
    },
    onSubmit: ({ value }) => {
      if (value.urlTitle === '') {
        return
      }

      if (!user) return

      const process = toast.loading('Updating link...')

      startTransition(async () => {
        const res = await updateLinkFn({
          data: {
            id: props.link.$id,
            ...value,
          },
        })

        if (!res.success) {
          toast.error(res.error, { id: process })
          return
        }

        await router.invalidate()
        toast.success('Successfully updated link!')
      })
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-auto py-1 text-xs uppercase"
          variant={'secondary'}
          size={'sm'}
        >
          <PenIcon className="size-3" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => isProcessing && e.preventDefault()}
        className="max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>Update Link</DialogTitle>
          <DialogDescription>
            Update your link information and details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg inline-flex space-x-2">
                {props.link.urlFavicon ? (
                  <img
                    src={new URL(
                      props.link.urlFavicon,
                      props.link.urlLink,
                    ).toString()}
                    alt="favicon"
                    className="h-6 w-6 rounded-full"
                  />
                ) : null}

                <span>{props.link.urlTitle}</span>
              </CardTitle>
              <CardDescription>{props.link.urlDescription}</CardDescription>
            </CardHeader>
            <CardContent className="grid">
              <div>
                <a
                  href={props.link.urlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 dark:text-blue-400 text-sm break-all"
                >
                  {props.link.urlLink}
                </a>
              </div>
            </CardContent>
          </Card>

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
                {isProcessing ? 'Updating...' : 'Update Link'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
