import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useDashboard } from "~/providers/DashboardProvider";

export default function DashboardLinksList() {
  const { linksQuery } = useDashboard();

  return (
    <div>
      {linksQuery.isLoading && <div>Loading...</div>}
      {linksQuery.isError && <div>Error loading links</div>}
      {linksQuery.isSuccess && (
        <div className="space-y-3">
          {linksQuery.data?.documents.map((link) => (
            <Card key={link.$id} className="flex items-start space-x-4">
              {link.urlLogo ? (
                <div className="relative h-32 w-32 p-6">
                  <img
                    src={link.urlLogo}
                    alt={link.urlTitle}
                    className="absolute w-full h-full object-cover"
                  />
                </div>
              ) : null}

              <div className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg inline-flex space-x-2">
                    {link.urlFavicon ? (
                      <img
                        src={new URL(link.urlFavicon, link.urlLink).toString()}
                        alt="favicon"
                        className="h-6 w-6 rounded-full"
                      />
                    ) : null}

                    <span className="truncate">{link.urlTitle}</span>
                  </CardTitle>
                  <CardDescription>{link.urlDescription}</CardDescription>
                </CardHeader>
                <CardContent className="grid">
                  <div>
                    <a
                      href={link.urlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm"
                    >
                      {link.urlLink}
                    </a>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
