import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getPublicEnv } from "~/components/public-env";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useIsOpen } from "~/shared-hooks/useIsOpen";
import { UrlError, UrlMetadata } from "~/typings/metadata";
import CreateLinkForm from "./CreateLinkForm";

const urlForm = z.object({
  url: z.string().url(),
});

type UrlForm = z.infer<typeof urlForm>;

export default function NewLink() {
  const [data, setData] = useState<UrlMetadata | UrlError | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { isOpen, setIsOpen } = useIsOpen();

  const form = useForm({
    resolver: zodResolver(urlForm),
    defaultValues: {
      url: "",
    },
  });

  const mutateFetchMetadata = useMutation({
    mutationFn: async (url: string) => {
      const apiUrl = new URL(getPublicEnv("SCRAPER_API"));
      apiUrl.searchParams.set("url", url);

      const response = await fetch(apiUrl.toString());
      const data = (await response.json()) as UrlMetadata | UrlError;
      return data;
    },
  });

  const onSubmit = async (data: UrlForm) => {
    if (data.url === "") {
      return;
    }

    setIsProcessing(true);
    const process = toast.loading("Fetching metadata...");

    await mutateFetchMetadata.mutateAsync(data.url, {
      onSuccess: (data) => {
        setData(data);
        setIsProcessing(false);

        toast.success("Metadata fetched successfully", { id: process });
      },
      onError: () => {
        toast.error("Failed to fetch metadata", { id: process });
        setIsProcessing(false);
      },
    });
  };

  useEffect(() => {
    if (isOpen) {
      form.reset();
      setData(null);
    }
  }, [form, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="space-x-2">
          <PlusIcon className="h-4 w-4" />
          <span>New</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="mx-auto w-full max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-bold">Create New Link</DialogTitle>
          <DialogDescription>
            Save a new link to your collection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                name="url"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>

                    <FormControl>
                      <Input {...field} placeholder="Website URL" />
                    </FormControl>
                    <FormMessage />

                    <FormDescription>
                      URL metadata (title and description) will be fetched first
                    </FormDescription>
                  </FormItem>
                )}
              />

              <div className="text-right">
                <Button disabled={isProcessing} type="submit">
                  {isProcessing ? "Fetching..." : "Fetch Metadata"}
                </Button>
              </div>
            </form>
          </Form>

          {/* Output from metadata scraper  */}
          <div className="">
            {!isProcessing && data ? (
              <>
                {"error" in data ? (
                  <Card className="border border-red-300">
                    <CardHeader>
                      <CardTitle className="text-lg">{data.error}</CardTitle>
                      <CardDescription>{data.url}</CardDescription>
                    </CardHeader>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg inline-flex space-x-2">
                        {data.favicon ? (
                          <img
                            src={new URL(data.favicon, data.url).toString()}
                            alt="favicon"
                            className="h-6 w-6 rounded-full"
                          />
                        ) : null}

                        <span>{data.title}</span>
                      </CardTitle>
                      <CardDescription>{data.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid">
                      <div>
                        <a
                          href={data.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-sm"
                        >
                          {data.requested_url}
                        </a>
                      </div>

                      <div className="mt-6">
                        <CreateLinkForm data={data} />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
