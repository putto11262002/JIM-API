import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="text-center space-y-5">
      <div className="font-bold">Page not Found</div>
      <Button onClick={() => navigate("/")}>Back to Home</Button>
    </div>
  );
}
