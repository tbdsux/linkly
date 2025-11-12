import { getUsersCategories } from '@/data/get-users-categories'
import { getUserLinks } from '@/data/get-users-links'
import { queryOptions } from '@tanstack/react-query'

export const fetchUserLinks = queryOptions({
  queryKey: ['userLinks'],
  queryFn: () => getUserLinks(),
})

export const fetchUserCategories = queryOptions({
  queryKey: ['userCategories'],
  queryFn: () => getUsersCategories(),
})
