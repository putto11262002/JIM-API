import { XCircle } from "lucide-react";
import  AppError  from "../../types/app-error";

function ErrorBlock({ error }: { error?: AppError | string }) {
  return (
    <div className="flex justify-center flex-col items-center">
      <XCircle className="text-danger" />
      <p className="mt-2 font-medium">
        {error ? (typeof error === "string" ? error :  error.message) : "Something went wrong. Please try again later"}
      </p>
    </div>
  );
}

export default ErrorBlock;
