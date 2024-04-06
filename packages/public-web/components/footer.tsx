import {
  Facebook,
  FacebookIcon,
  IconNode,
  Instagram,
  LucideProps,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "../lib/utils";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { footerNavItems } from "../data/nav-menu";

function IconButton({ comp: Comp }: { comp: React.FC<LucideProps> }) {
  return (
    <Link href={"/"}>
      <button
        className={
          "h-6 w-6 flex items-center justify-center rounded-full cursor-pointer hover:bg-muted"
        }
      >
        {<Comp className="w-4 h-4" />}
      </button>
    </Link>
  );
}

function Footer() {
  return (
    <footer className="flex justify-center">
      <div className="grid grid-cols-1  md:grid-cols-2 container gap-6 md:gap-3 py-8">
        <div className="order-last md:order-first">
          <h1 className="font-bold text-xl">J.I.M</h1>
          <h2 className="text-sm mt-1">
            1201/5 Town in town soi 2 , Phlabphla, Wang Thonglang, Bangkok
            Thailand, 10310
          </h2>
          <div className="flex items-center space-x-2 mt-2">
            <IconButton comp={Instagram} />
            <IconButton comp={FacebookIcon} />
            <IconButton comp={Mail} />
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            © 2024 J.I.M. Modeling Agency. All rights reserved.
          </p>
        </div>

        <div className="flex justify-start md:justify-end">
          <nav>
            <ul className="flex flex-col space-y-4">
              {footerNavItems.map((item, index) => (
                <li key={index} className={"text-muted-foreground text-sm"}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
