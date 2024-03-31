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
import { Trash, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { ModelImage } from "@jimmodel/shared";

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

const ImageGallery = ({ images }: { images: ModelImage[] }) => {
  const grid = useMemo(() => {
    const grid: ModelImage[][] = [];
    const numCol = 3;

    for (let i = 0; i < numCol; i++) {
      grid.push([]);
    }

    let curInx = 0;
    while (curInx < images.length) {
      const c = curInx % 3;
      grid[c].push(images[curInx]);
      curInx++;
    }

    return grid;
  }, [images]);
  return (
    <div className="grid grid-cols-3 gap-3">
      {grid.map((col) => (
        <div className="flex flex-col gap-3">
          {col.map((image) => (
            <div className="group relative">
              <div className="absolute  bg-slate-700 bg-opacity-50 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition duration-300">
                <div className="cursor-pointer w-8 h-8 flex items-center justify-center bg-white rounded-full">
                  <Trash className="w-4 h-4 text-black" />
                </div>
              </div>
              <img className="w-full h-auto" src={image.url} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

function MediaForm({
  onAddImage,
  images,
  type,
}: {
  onAddImage: ({ image, type }: { image: File; type: string }) => void;
  images: ModelImage[];
  type: string;
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
        <ImageGallery images={images.filter((image) => image.type == type)} />
      </div>
    </div>
  );
}

export default MediaForm;
