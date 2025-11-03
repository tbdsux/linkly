import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'

export default function NotFoundError() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>404 - Page Not Found</CardTitle>
        <CardDescription>
          The page you are looking for does not exist.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
