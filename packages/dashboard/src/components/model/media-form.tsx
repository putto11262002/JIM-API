import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import _ from "lodash";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Trash, Upload, User } from "lucide-react";
import { useState } from "react";
import { ModelImage } from "@jimmodel/shared";
import ImageGallery from "../shared/image-gallery";

const allowedMimetype = ["image/jpg", "image/png", "image/jpeg"];

const ModelImageUploadFormSchema = z.object({
  image: z
    .any()
    .refine((file) => file instanceof File, "No file selected")
    .transform((file) => file as File)
    .refine(
      (file) => allowedMimetype.includes(file?.type),
      `Only ${allowedMimetype
        .map((mimetype) => mimetype.split("/").pop())
        .join(", ")} are allowed`
    )
    .refine(
      (file) => file?.size < 5 * 1000 * 1000,
      "File size cannot exceed 5MB"
    ),
});
function ImageUploadDialog({
  type,
  onSubmit,
}: {
  type: string;
  onSubmit: (image: File) => void;
}) {
  const form = useForm<z.infer<typeof ModelImageUploadFormSchema>>({
    resolver: zodResolver(ModelImageUploadFormSchema),
  });

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="w-full" variant={"outline"}>
          <Upload className="h-4 w-4 mr-2" /> Upload {_.upperFirst(type)} Image
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload {_.upperFirst(type)}</DialogTitle>
          <DialogDescription>Upload {type} for model</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-3"
            onSubmit={form.handleSubmit((data) => {
              setOpenDialog(false);
              onSubmit(data.image);
            })}
          >
            <FormField
              name="image"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Button type="submit">Upload</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function MediaForm({
  onAddImage,
  images,
  type,
  onRemoveImage,
  onSetProfileImage
}: {
  onAddImage: ({ image, type }: { image: File; type: string }) => void;
  images: ModelImage[];
  type: string;
  onRemoveImage: (args: { imageId: string; modelId: string }) => void;
  onSetProfileImage: (args: { imageId: string; modelId: string }) => void;
}) {
  return (
    <div>
      <div className="mt-6">
        <ImageUploadDialog
          type={type}
          onSubmit={(image) => onAddImage({ image, type })}
        />
      </div>
      <div className="mt-4">
        <ImageGallery
          overlayContent={(image) => {
            return (
              <div className="flex space-x-2">
                <div
                  onClick={() =>
                    onRemoveImage({ imageId: image.id, modelId: image.modelId })
                  }
                  className="cursor-pointer w-8 h-8 flex items-center justify-center bg-white rounded-full"
                >
                  <Trash className="w-4 h-4 text-black" />
                </div>

                <div
                  onClick={() =>
                    onSetProfileImage({ imageId: image.id, modelId: image.modelId })
                  }
                  className="cursor-pointer w-8 h-8 flex items-center justify-center bg-white rounded-full"
                >
                  <User className="w-4 h-4 text-black" />
                </div>
              </div>
            );
          }}
          images={images.filter((image) => image.type == type)}
        />
      </div>
    </div>
  );
}

export default MediaForm;
