import { useQuery } from "@tanstack/react-query";
import modelService from "../../../services/model";
export default function useGetModel({ id }: { id: string }) {
  const { data, isPending, error } = useQuery({
    queryKey: ["models", id],
    queryFn: id
      ? ({ signal }) => modelService.getById({ signal, id })
      : undefined,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
  return { model: data, isPending, error };
}
