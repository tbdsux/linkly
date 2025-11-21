import { Link } from '@/types/links'
import EditLink from './edit-link'
import RemoveLink from './remove-link'

export default function LinksItemCardActions(props: { link: Link }) {
  return (
    <div className="absolute top-2 right-2 hidden group-hover:block group-focus:block">
      <div className="space-x-2">
        <EditLink link={props.link} />

        <RemoveLink link={props.link} />
      </div>
    </div>
  )
}
