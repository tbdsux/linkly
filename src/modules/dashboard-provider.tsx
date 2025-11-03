import { Category } from '@/types/links'
import { createContext, PropsWithChildren, use } from 'react'

const dashboardContext = createContext<{
  categories: Category[]
}>({
  categories: [],
})

export default function DashboardProvider(
  props: PropsWithChildren<{
    categories: Category[]
  }>,
) {
  return (
    <dashboardContext.Provider
      value={{
        categories: props.categories,
      }}
    >
      {props.children}
    </dashboardContext.Provider>
  )
}

export const useDashboardData = () => {
  return use(dashboardContext)
}
