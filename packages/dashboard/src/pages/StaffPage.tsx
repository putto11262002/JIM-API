import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";

import {
  StaffGetQuery,
} from "@jimmodel/shared";
import AddStaffDialog from "../components/staffs/add-staff-dialog";
import { useState } from "react";
import StaffTable from "../components/staffs/StaffTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { StaffRole } from "@prisma/client";
import { useGetStaffs } from "../hooks/staff/useGetStaffs";
const pageSize = 10;


export default function StaffPage() {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<StaffGetQuery>({});


  const { data, isPending, error } = useGetStaffs({ query, page })

  function handlePageChange(_page: number) {
    if (page < 1 || page > (data?.totalPage ?? 0)) return;
    setPage(_page);
  }

  return (
    <>
      <div className="flex justify-between py-2 gap-3">
        <div className="flex gap-3 grow">
          <Input
            onChange={(e) => {
              setQuery((prevQuery) => ({ ...prevQuery, q: e.target.value }));
              setPage(1);
            }}
            placeholder="Name, Email..."
            className="w-2/5"
          />

          <Select onValueChange={(value) => {
            setQuery(prevQuery => ({ ...prevQuery, roles: value === "*" ? undefined : [value as StaffRole] }))
            setPage(1)
          }}>
            <SelectTrigger className="w-1/5" defaultValue={"*"}>
              <SelectValue placeholder="Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">All</SelectItem>
              {Object.values(StaffRole).map((role) => (
                <SelectItem value={role} key={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <AddStaffDialog />
        </div>
      </div>
      <div className="py-4">
        <StaffTable
          error={error}
          isLoading={isPending}
          pagination={{ page, pageSize, totalPage: data?.totalPage ?? 0 }}
          data={data?.data || []}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
