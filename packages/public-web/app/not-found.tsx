import { Button } from "@/components/ui/button";
import Link from "next/link";

function NotFoundPage() {
  return (
    <div className="text-center">
      <p className="mt-16">Page Not Found</p>

      <Link  href={"/"}>
        <Button className="mt-5">Home</Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
