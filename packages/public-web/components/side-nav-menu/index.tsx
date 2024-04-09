import { SheetTrigger, SheetContent, Sheet } from "../ui/sheet";
import MenuItem from "./menu-item";
import { headerNavItems } from "@/data/nav-menu";

function SideNavMenu({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="max-w-[60vw]">
        <nav className="mt-6 w-full">
          <ul className="space-y-3 w-full">
            {headerNavItems.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default SideNavMenu;
