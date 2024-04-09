import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { lowerCase, upperFirst } from "lodash";
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
import { MoreHorizontal, Upload } from "lucide-react";
import { useState } from "react";
import { ModelImage } from "@jimmodel/shared";
import { ModelImageType } from "../../types/model";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../job/data-table";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FromSelectField } from "../shared/form/FormSelectField";
import useRemoveImage from "../../hooks/model/use-remove-image";
import useSetProfileImage from "../../hooks/model/use-set-profile-image";
import { useUpdateModelImageType } from "../../hooks/model/use-update-model-image-type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const columns: ColumnDef<ModelImage>[] = [
  {
    id: "image",
    cell: ({ row }) => {
      return (
        <img src={row.original.url} alt="" className="object-cover h-12 w-12" />
      );
    },
  },
  {
    header: "Type",
    cell: ({ row }) => upperFirst(lowerCase(row.original.type)),
  },
  {
    header: "Created At",
    cell: ({ row }) => dayjs(row.original.createdAt).format("DD/MM/YYYY"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ModelImageDropdownMenu image={row.original}>
          <Button variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </ModelImageDropdownMenu>
      );
    },
  },
];

function ModelImageDropdownMenu({
  children,
  image,
}: {
  children: React.ReactNode;
  image: ModelImage;
}) {
  const { removeImage } = useRemoveImage();
  const { setProfile } = useSetProfileImage();
  const { updateModelImageType } = useUpdateModelImageType();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-54">
        <DropdownMenuItem
          onClick={() =>
            removeImage({ imageId: image.id, modelId: image.modelId })
          }
        >
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={image.profile}
          onClick={() => setProfile({ imageId: image.id })}
        >
          Set as profile
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Change type</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {Object.values(ModelImageType).map((type) => (
                <DropdownMenuItem
                  disabled={image.type === type}
                  key={type}
                  onClick={() =>
                    updateModelImageType({ imageId: image.id, input: { type } })
                  }
                >
                  {upperFirst(lowerCase(type))}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
  type: z.nativeEnum(ModelImageType),
});
function ImageUploadDialog({
  onSubmit,
  children,
}: {
  onSubmit: ({ image, type }: { image: File; type: ModelImageType }) => void;
  children: React.ReactNode;
}) {
  const form = useForm<z.infer<typeof ModelImageUploadFormSchema>>({
    resolver: zodResolver(ModelImageUploadFormSchema),
  });

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload </DialogTitle>
          {/* <DialogDescription>Upload {type} for model</DialogDescription> */}
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-3"
            onSubmit={form.handleSubmit((data) => {
              setOpenDialog(false);
              onSubmit({ image: data.image, type: data.type });
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
            <FromSelectField
              name="type"
              form={form}
              options={Object.values(ModelImageType).map((type) => ({
                label: upperFirst(lowerCase(type)),
                value: type,
              }))}
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
}: {
  onAddImage: ({ image, type }: { image: File; type: string }) => void;
  images: ModelImage[];
  onRemoveImage: (args: { imageId: string; modelId: string }) => void;
  onSetProfileImage: (args: { imageId: string; modelId: string }) => void;
}) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div>
      <div className="mt-6 flex justify-between">
        <div className="w-32">
          <Select
            value={selectedType || ""}
            defaultValue={selectedType || ""}
            onValueChange={(value) => setSelectedType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ModelImageType).map((type) => (
                <SelectItem value={type} key={type}>
                  {upperFirst(lowerCase(type))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ImageUploadDialog
          onSubmit={({ image, type }) => onAddImage({ image, type })}
        >
          <Button className="" variant={"outline"}>
            <Upload className="h-4 w-4 mr-2" /> Upload Image
          </Button>
        </ImageUploadDialog>
      </div>
      <div className="mt-4">
        <DataTable
          data={
            selectedType === null
              ? images
              : images.filter((image) => image.type === selectedType)
          }
          columns={columns}
        />
      </div>
    </div>
  );
}

export default MediaForm;
