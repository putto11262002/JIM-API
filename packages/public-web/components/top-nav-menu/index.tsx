"use client";
import Link from "next/link";
import { NavMenuItem } from "../../data/nav-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { cn } from "../../lib/utils";

function MenuItem(item: NavMenuItem) {
  if ("children" in item) {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
        <NavigationMenuContent className="">
          <ul className="w-[300px] p-2">
            {item.children.map((child, index) => (
              <li className="block w-full" key={index}>
                <Link className="" href={child.href} passHref legacyBehavior>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "block w-full")}
                  >
                    {child.label}
                  </NavigationMenuLink>
                </Link>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <Link href={item.href} legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          {item.label}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}

function TopNavMenu({ items }: { items: NavMenuItem[] }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item, index) => (
          <MenuItem key={index} {...item} />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default TopNavMenu;
