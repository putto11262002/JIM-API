import { useState } from "react";
import jobService from "../../services/job";
import { useQuery } from "@tanstack/react-query";

const PAGE_SIZE = 5

export default function useGetModelJobs({ id, initialPage }: { id: string, initialPage?: number }) {

  const [page, setPage] = useState(initialPage ?? 1)

  const { isLoading, data } = useQuery({
    queryKey: ["jobs", "models", id,  { page , pageSize: PAGE_SIZE}],
    queryFn: id
      ? ({ signal }) =>
          jobService.getModelJobs({
            modelId: id,
            query: { page, pageSize: PAGE_SIZE },
            signal,
          })
      : undefined,
    enabled: !!id,
  });

  function nextPage(){
    if(!data) return 
    if (page >= data.totalPage) return  
     setPage(prevPage => prevPage + 1) 
  }
  
  function prevPage(){
    if (!data) return 
    if (page <= 1) return
    setPage(prevPage => prevPage - 1)
  }

  return { jobs: data?.data ?? [], isLoading, nextPage, prevPage, page, totalPage: data?.totalPage ?? 0};
}
