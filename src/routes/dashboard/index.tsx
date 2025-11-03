import { getUsersCategories } from '@/data/get-users-categories'
import { getUserLinks } from '@/data/get-users-links'
import NewCategory from '@/modules/categories/new-category'
import DashboardProvider from '@/modules/dashboard-provider'
import LinksList from '@/modules/link-management/links-list'
import NewLink from '@/modules/link-management/new-link'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Dashboard - LinkStore',
      },
    ],
  }),
  loader: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/login' })
    }

    const userLinks = await getUserLinks({
      data: {
        userId: context.user.$id,
      },
    })

    const userCategories = await getUsersCategories({
      data: {
        userId: context.user.$id,
      },
    })

    return {
      userLinks,
      userCategories,
    }
  },
})

function RouteComponent() {
  const { userLinks, userCategories } = Route.useLoaderData()

  return (
    <DashboardProvider categories={userCategories.rows}>
      <div className="flex-1 px-4 lg:px-6 mx-auto w-full">
        <div className="flex justify-between items-center space-x-4 w-full">
          <h3 className="font-bold text-lg">All Links</h3>

          <div className="inline-flex items-center space-x-2">
            <NewLink />
            <NewCategory categoryCount={userCategories.total} />
          </div>
        </div>

        <hr className="my-4" />

        <LinksList userLinks={userLinks} />
      </div>
    </DashboardProvider>
  )
}
