import Link from "next/link"

function BreadCrumb({path}: {path: {label: string, href: string}[]}){
    return <div className="text-sm">
        {
            path.map((item, index) => {
                return <>{(index > 0) &&   <span className="text-muted-foreground"> &gt; </span>}
                    <Link className="" href={item.href}>{item.label}</Link>
                    </>
               

            })
        }
  </div>
}


export default BreadCrumb