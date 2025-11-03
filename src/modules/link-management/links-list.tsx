import { Links } from '@/types/links'
import { Models } from 'node-appwrite'
import LinksItemCard from './links-item-card'

export default function LinksList(props: { userLinks: Models.RowList<Links> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {props.userLinks.rows.map((link) => (
        <LinksItemCard key={link.$id} link={link} />
      ))}
    </div>
  )
}
