import { fetchUserLinks } from '@/services/queries/user-dashboard'
import { useSuspenseQuery } from '@tanstack/react-query'
import LinksItemCard from './links-item-card'

export default function LinksList() {
  const userLinks = useSuspenseQuery(fetchUserLinks)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {userLinks.data.rows.map((link) => (
        <LinksItemCard key={link.$id} link={link} />
      ))}
    </div>
  )
}
