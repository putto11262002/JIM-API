import { Button } from "@components/ui/button";
import React from "react";

export default function Pagination({
  page,
  totalPage,
  nextPage,
  prevPage,
  ...rest
}: {
  page: number;
  totalPage: number;
  nextPage: () => void;
  prevPage: () => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest}>
      <div className={"flex items-center space-x-3"}>
        <Button variant={"outline"} disabled={page <= 1} onClick={prevPage}>
          Previous
        </Button>
        <p className="font-medium">
          {page} of {totalPage}
        </p>
        <Button
          disabled={page >= totalPage}
          variant={"outline"}
          onClick={nextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
