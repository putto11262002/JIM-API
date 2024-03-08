import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../lib/axios";
import {
  ApiResponse,
  PaginatedData,
  StaffWithoutPassword,
} from "@jimmodel/shared";
import AddStaffDialog from "../components/staffs/AddStaffDialog";
import { useState } from "react";
import StaffTable from "../components/staffs/StaffTable";
import { GenericAbortSignal } from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { StaffRole } from "@prisma/client";
import { StaffQuerySchema } from "../schemas/staff";
import { z } from "zod";
const pageSize = 10;


export default function StaffPage() {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<z.infer<typeof StaffQuerySchema>>({});


  const { data, isPending } = useQuery({
    queryKey: ["staffs", page, query],
    queryFn: async ({ signal }: { signal: GenericAbortSignal }) => {
      const val = StaffQuerySchema.safeParse({page, pageSize, ...query})
      if (!val.success){
        console.error(val.error)
        throw new Error("failed to validate queries")
      }
      
      const res = await axiosClient.get("/staffs", {
        params: val.data,
        signal,
      });
      const data = res.data as ApiResponse<PaginatedData<StaffWithoutPassword>>;
      return data.data;
    },
    
  });

  function handlePageChange(_page: number) {
    if (page < 1 || page > (data?.totalPage ?? 0)) return;
    setPage(_page);
  }

  return (
    <>
      <div className="flex justify-between py-4">
        <div className="flex gap-3">
          <Input
            onChange={(e) => {
              setQuery((prevQuery) => ({ ...prevQuery, q: e.target.value }));
              setPage(1);
            }}
            placeholder="Name, Email..."
            className=""
          />

          <Select onValueChange={(value) => {
            setQuery(prevQuery => ({...prevQuery, roles: value}))
            setPage(1)
            }}>
            <SelectTrigger defaultValue={"*"}>
              <SelectValue  placeholder="Roles"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="*">All</SelectItem>
              {Object.values(StaffRole).map((role) => (
                <SelectItem value={role} key={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* <Button   className="bg-white text-current hover:bg-white border">
            Advance Filter
          </Button> */}
          {/* <Button onClick={() => console.log(form.getValues())}>Search</Button> */}
        </div>

        <div>
          <AddStaffDialog />
        </div>
      </div>
      <div>
        <StaffTable
          isLoading={isPending}
          pagination={{ page, pageSize, totalPage: data?.totalPage ?? 0 }}
          data={data?.data || []}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
