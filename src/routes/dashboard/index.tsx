import NewCategory from '@/modules/categories/new-category'
import DashboardProvider from '@/modules/dashboard-provider'
import LinksList from '@/modules/link-management/links-list'
import NewLink from '@/modules/link-management/new-link'
import {
  fetchUserCategories,
  fetchUserLinks,
} from '@/services/queries/user-dashboard'
import { useSuspenseQuery } from '@tanstack/react-query'
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

    context.queryClient.ensureQueryData(fetchUserLinks)

    context.queryClient.ensureQueryData(fetchUserCategories)
  },
})

function RouteComponent() {
  const userCategories = useSuspenseQuery(fetchUserCategories)

  return (
    <DashboardProvider categories={userCategories.data.rows}>
      <div className="flex-1 px-4 lg:px-6 mx-auto w-full">
        <div className="flex justify-between items-center space-x-4 w-full">
          <h3 className="font-bold text-lg">All Links</h3>

          <div className="inline-flex items-center space-x-2">
            <NewLink />
            <NewCategory categoryCount={userCategories.data.total} />
          </div>
        </div>

        <hr className="my-4" />

        <LinksList />
      </div>
    </DashboardProvider>
  )
}
