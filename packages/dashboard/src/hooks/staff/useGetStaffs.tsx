import { StaffGetQuery } from "@jimmodel/shared";
import { useQuery } from "@tanstack/react-query";
import { GenericAbortSignal } from "axios";
import staffService from "../../services/auth";
import { useEffect, useState } from "react";
import { AppError } from "../../types/app-error";
import { getAppError } from "../../lib/error";

export function useGetStaffs({
  page,
  query,
  pageSize,
}: {
  page?: number;
  query?: StaffGetQuery;
  pageSize?: number;
}) {
  const [error, setError] = useState<AppError | null>(null);
  const {
    data,
    isPending,
    error: _error,
  } = useQuery({
    queryKey: ["staffs", page, query],
    queryFn: async ({ signal }: { signal: GenericAbortSignal }) => {
      const data = await staffService.getAll(
        { ...(query ? query : {}), page, pageSize },
        signal
      );

      return data;
    },
  });

  useEffect(() => {
    if (_error) setError(getAppError(_error))
  }, [_error]);

  return { data, isPending, error };
}
