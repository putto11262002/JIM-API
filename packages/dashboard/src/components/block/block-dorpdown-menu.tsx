import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Block } from "@jimmodel/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import blockService from "../../services/block";
import useNotification from "../../hooks/use-notification";

function useDeleteBlockById(){
  const queryClient = useQueryClient()
  const {success} = useNotification()
  const {mutate, isPending} = useMutation({
    mutationFn: async (args: {id: string}) => blockService.deleteById(args),
    onSuccess: () => {
     queryClient.invalidateQueries({queryKey: ["blocks"]})
     queryClient.invalidateQueries({queryKey: ["calendar"]})
     success("Block deleted")
    }
  })
  return {deleteBlock: mutate, isPending}
}

export default function BlockDropdownMenu({
  children,
  block,
}: {
  children: ReactNode;
  block: Block;
}) {
  const { deleteBlock } = useDeleteBlockById();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => deleteBlock({ id: block.id })}>Delete</DropdownMenuItem>
        <DropdownMenuItem>View</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
