import { Separator } from "../ui/separator";

function PageTitle({title, subtitle}: {title: string, subtitle?: string}) {
    return  <>
      <div className="space-y-1">
    <h2 className="text-xl font-bold">{title}</h2>
    <p className="text-muted-foreground">
      {subtitle}
    </p>
  </div>
  <Separator className="my-6" />
    </>
}

export default PageTitle