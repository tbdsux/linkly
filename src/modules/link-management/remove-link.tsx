import { removeLinkFn } from '@/actions/link-actions'
import { useAuth } from '@/components/auth-provider'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Links } from '@/types/links'
import { useRouter } from '@tanstack/react-router'
import { TrashIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

export default function RemoveLink(props: { link: Links }) {
  const { user } = useAuth()

  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, startTransition] = useTransition()

  const router = useRouter()

  const handleSubmit = async () => {
    if (!user) return

    const process = toast.loading('Removing link...')

    startTransition(async () => {
      const res = await removeLinkFn({
        data: {
          id: props.link.$id,
        },
      })
      if (!res.success) {
        toast.error(res.error, { id: process })
        return
      }

      await router.invalidate()

      startTransition(() => {
        toast.success('Successfully removed link!', { id: process })
        setIsOpen(false)
      })
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="h-auto py-1 text-xs uppercase"
          variant={'destructive'}
          size={'sm'}
        >
          <TrashIcon className="size-3" />
          Remove
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to remove this link?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Removing this link will permanently delete it from your collection.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
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
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <form
            onSubmit={(e) => {
              handleSubmit()

              e.preventDefault()
            }}
          >
            <Button
              type="submit"
              disabled={isProcessing}
              className="cursor-pointer"
              variant={'destructive'}
            >
              {isProcessing ? 'Removing...' : 'Yes, Remove Link'}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
