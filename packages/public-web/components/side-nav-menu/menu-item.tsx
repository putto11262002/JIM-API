"use client";
import Link from "next/link";
import { NavMenuItem } from "@/data/nav-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

function ItemLink( item: Extract<NavMenuItem, {label: string, href: string}>) {
    return   <li className="cursor-pointer font-medium w-full">
    <Link href={item.href} passHref legacyBehavior>
      {item.label}
    </Link>
  </li>

}

function MenuItem(item: NavMenuItem) {
  const [open, setOpen] = useState(false);
  if ("children" in item) {
    return (
      <li className="cursor-pointer font-medium">
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex outline-none items-center justify-between w-full">
              {item.label}{" "}
              {open ? (
                <ChevronUp className="w-6 h-6 ml-2" />
              ) : (
                <ChevronDown className="w-6 h-6 ml-2" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent >
            <ul className="space-y-3 pl-3 mt-3">
              {item.children.map((item, index) => (
                <ItemLink key={index} {...item}/>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </li>
    );
  }
  return (
    <>
    <ItemLink {...item}/>
    </>
  );
}

export default MenuItem;
