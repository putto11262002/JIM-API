import { ModelApplication } from "@jimmodel/shared";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { AppError } from "../../types/app-error";
import { DataTable } from "../shared/data-table";
import { Link } from "react-router-dom";

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
    pagination: {page: number, pageSize: number, totalPage: number},
    onPageChange: (page: number) => void,
    isLoading?: boolean,
    error: null | AppError
}

export default function ApplicationTable({
    data,
    pagination,
    onPageChange,
    isLoading = false,
    error
}: ApplicationTableProps) {
    return (
        <DataTable
            error={error}
            isLoading={isLoading}
            columns={columns}
            data={data}
            pagination={pagination}
            onPageChange={onPageChange}
        />
    )
}