import { createCategoryFn } from '@/actions/create-category'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import z from 'zod'

const formSchema = z.object({
  name: z.string().min(3, { error: 'Category name length should be > 3' }),
})

export default function NewCategory(props: { categoryCount: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, startTransition] = useTransition()

  const router = useRouter()

  const form = useForm({
    defaultValues: {
      name: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const { name } = value

      const process = toast.loading('Creating category...')

      startTransition(async () => {
        const res = await createCategoryFn({
          data: {
            name,
          },
        })

        if (!res.success) {
          toast.error(
            res.error || 'An error occurred while creating the category.',
            {
              id: process,
            },
          )
          return
        }

        router.invalidate()

        startTransition(() => {
          toast.success('Category created successfully!', { id: process })
          form.reset()
          setIsOpen(false)
        })
      })
    },
  })

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        onClick={(e) => isProcessing && e.preventDefault()}
        asChild
      >
        <Button>({props.categoryCount}) Add Category</Button>
      </PopoverTrigger>

      <PopoverContent className="w-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Category Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="i.e, Productivity, Special"
                      autoComplete="off"
                    />
                    <FieldDescription>
                      A unique category name / tag.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>

          <div className="text-right">
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
