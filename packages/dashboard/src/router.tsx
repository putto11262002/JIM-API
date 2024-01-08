import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CalendarPage from "./pages/CalendarPage";
import PrimaryLayout from "./components/layouts/PrimaryLayout";
import InitApp from "./components/InitApp";

const router = createBrowserRouter([
  {
    element: <InitApp/>,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute/>,
        children: [
          {
            element: <PrimaryLayout/>,
            children: [
              {
                path: "/",
                element: <CalendarPage/>
              },
              {
                path: "*",
                element: <NotFoundPage />,
              },
            ]
          }
    
        ]
      }
    ]
  }
  
 
]);

export default router;
