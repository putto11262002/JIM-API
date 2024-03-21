import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Block } from "@jimmodel/shared";

export default function BlockDropdownMenu({
  children,
  block,
}: {
  children: ReactNode;
  block: Block;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>Delete</DropdownMenuItem>
        <DropdownMenuItem>View</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
