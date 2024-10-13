import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "~/auth/AuthProvider";
import { getPublicEnv } from "~/components/public-env";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { databases } from "~/lib/appwrite";
import { useIsOpen } from "~/shared-hooks/useIsOpen";

export default function DeleteLink(props: { linkTitle: string; id: string }) {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const { isOpen, setIsOpen } = useIsOpen();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    if (!user) return;

    setIsProcessing(true);
    const process = toast.loading("Deleting link...");

    try {
      // Delete the link
      await databases.deleteDocument(
        getPublicEnv("APPWRITE_DATABASE_ID"),
        getPublicEnv("APPWRITE_COLLECTION_STORE"),
        props.id
      );

      // Refresh
      await queryClient.invalidateQueries({
        queryKey: ["dashboard-links"],
      });

      toast.success("Link deleted successfully", { id: process });
      setIsOpen(false);
    } catch (err) {
      toast.error(`Failed to delete link: ${(err as Error).message}`, {
        id: process,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button
          variant={"destructive"}
          className="text-sm h-auto py-1 space-x-1 px-2"
        >
          <TrashIcon className="h-4 w-4" />
          <span>Delete</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => isProcessing && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Remove Link</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this link{" "}
            <strong>
              {'"'}
              {props.linkTitle}
              {'"'}
            </strong>
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="space-x-2">
          <DialogClose asChild disabled={isProcessing}>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <Button
            disabled={isProcessing}
            variant={"destructive"}
            onClick={handleDelete}
          >
            {isProcessing ? "Deleting..." : "Yes, remove link"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
