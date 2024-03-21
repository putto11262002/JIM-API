import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router-dom";

function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  const navigate = useNavigate()
  return (
    <>
      <div className="flex items-center">
        <Button onClick={() => navigate(-1)} size={"sm"} variant={"ghost"} className="mr-3">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
      </div>

      <Separator className="my-6 mt-2" />
    </>
  );
}

export default PageTitle;
