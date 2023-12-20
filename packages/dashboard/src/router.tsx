import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
    {
      
                path: "/login",
                element: <LoginPage/>
       
    },
    {
        path: "*",
        element: <NotFoundPage/>
    }
])

export default router