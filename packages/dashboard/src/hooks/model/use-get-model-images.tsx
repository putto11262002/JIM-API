import { useQuery } from "@tanstack/react-query";
import modelService from "../../services/model";
export default function useGetModelImages({ id }: { id?: string }) {
  const { data, isPending, error } = useQuery({
    queryKey: ["models", id, "images"],
    queryFn: id
      ? ({ signal }) => modelService.getImages({ signal, id })
      : undefined,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
  return { images: data, isPending, error };
}
