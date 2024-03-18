import { XCircle } from "lucide-react";
import { AppError } from "../../types/app-error";

function ErrorBlock({ error }: { error?: AppError }) {
  return (
    <div className="flex justify-center flex-col items-center space-y-2">
      <XCircle className="text-danger" />
      <p>
        {error ? error.message : "Something went wrong. Please try again later"}
      </p>
    </div>
  );
}

export default ErrorBlock;
