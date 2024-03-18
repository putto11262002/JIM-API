import { cn } from "../../../lib/utils";
import { buttonVariants } from "../../ui/button";

export function SideBar({
    menuItems,
    selected,
    onChange,
  }: {
    menuItems: { label: string; value: string }[];
    selected: string;
    onChange?: ({ value, index }: { value: string; index: number }) => void;
  }) {
    return (
      <div>
        <ul className="flex flex-col">
          {menuItems.map((item, index) => (
            <li
              onClick={() => onChange && onChange({ value: item.value, index })}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start",
                selected === item.value
                  ? "bg-muted"
                  : "hover:underline hover:bg-transparent"
              )}
              key={index}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    );
  }