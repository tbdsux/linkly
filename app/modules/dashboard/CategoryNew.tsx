import { zodResolver } from "@hookform/resolvers/zod";
import { ID } from "appwrite";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "~/auth/AuthProvider";
import { getPublicEnv } from "~/components/public-env";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { databases } from "~/lib/appwrite";
import { useIsOpen } from "~/shared-hooks/useIsOpen";

const categoryForm = z.object({
  name: z.string(),
});

type CategoryForm = z.infer<typeof categoryForm>;

export default function CategoryNew() {
  const { user } = useAuth();

  const { isOpen, setIsOpen } = useIsOpen();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm({
    resolver: zodResolver(categoryForm),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CategoryForm) => {
    if (data.name === "") {
      return;
    }

    if (!user) return;

    setIsProcessing(true);

    try {
      await databases.createDocument(
        getPublicEnv("APPWRITE_DATABASE_ID"),
        getPublicEnv("APPWRITE_COLLECTION_CATEGORIES"),
        ID.unique(),
        {
          name: data.name, // should be unique
          ownerId: user.$id,
        }
      );

      setIsProcessing(false);
      toast.success("Category created successfully");
      form.reset();
      setIsOpen(false);
    } catch (err) {
      toast.error(`Failed to create category: ${(err as Error).message}`);
      setIsProcessing(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        onClick={(e) => isProcessing && e.preventDefault()}
        asChild
      >
        <Button>Add Category</Button>
      </PopoverTrigger>

      <PopoverContent
        onInteractOutside={(e) => isProcessing && e.preventDefault()}
        className="space-y-4 w-96"
      >
        <div className="">
          <h3 className="font-bold">New Category</h3>
          <p className="text-slate-600 text-sm">
            Add a new category to organize your links
          </p>
        </div>

        <div>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter new category name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <Button disabled={isProcessing} type="submit">
                  {isProcessing ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
