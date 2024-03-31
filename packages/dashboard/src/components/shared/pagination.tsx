import { Button } from "@components/ui/button";

export default function Pagination({
  page,
  totalPage,
  nextPage,
  prevPage,
}: {
  page: number;
  totalPage: number;
  nextPage: () => void;
  prevPage: () => void;
}) {
  return (
    <div className="flex items-center space-x-3">
      <Button
                variant={"outline"}
                disabled={page <= 1}
                onClick={prevPage}
              >
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
  );
}
