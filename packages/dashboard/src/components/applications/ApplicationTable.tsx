import { ModelApplication } from "@jimmodel/shared";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DataTable from "../job/data-table";
import React from "react";

const columns: ColumnDef<ModelApplication>[] = [
    {
        id: "name",
        header: () => <div className="text-left">Name</div>,
        cell: ({row}) => {
            return <div>{row.original.firstName} {row.original.lastName}</div>
        }
    },
    {
        accessorKey: "email",
        header: () => <div className="text-left">Email</div>,
    },
    {
        id: "actions",
        cell: ({row}) => {
            return (
             <div className="text-right">
                  <Link to={`/model-applications/${row.original.id}`}>
                  <Button variant="ghost" size="sm">
                    View
                    <ArrowRight className="w-4 h-4 ml-2"/>

                </Button>
                </Link>
             </div>
            )
        }
    }
]


type ApplicationTableProps = {
    data: ModelApplication[],
}

export default function ApplicationTable({
    data,
    ...rest
}: ApplicationTableProps & React.HTMLAttributes<HTMLDivElement>) {
    return (
     <div {...rest}>
           <DataTable
            columns={columns}
            data={data}
        />
     </div>
    )
}