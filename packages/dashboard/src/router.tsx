import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/globals/ProtectedRoute";
import CalendarPage from "./pages/CalendarPage";
import PrimaryLayout from "./components/layouts/PrimaryLayout";
import InitApp from "./components/globals/InitApp";
import StaffPage from "./pages/StaffPage";
import ApplicationSubmissionPage from "./pages/ApplicationSubmissionPage";

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
                path: "/staffs",
                element: <StaffPage/>
              },
              {
                path: "*",
                element: <NotFoundPage />,
              },
            ]
          }
    
        ]
      }
    ],
    
  },
  {
    path: "/model-applications/submit",
    element: <ApplicationSubmissionPage/>
  }
  
 
]);

export default router;
