import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/globals/ProtectedRoute";
import CalendarPage from "./pages/CalendarPage";
import PrimaryLayout from "./components/layouts/PrimaryLayout";
import InitApp from "./components/globals/InitApp";
import StaffPage from "./pages/StaffPage";
import ApplicationSubmissionPage from "./pages/model-application-submission";
import AppilcationPage from "./pages/AppilcationPage";
import ApplicationDetailsPage from "./pages/ApplicationDetailsPage";
import ModelPage from "./pages/model";
import AddModelPage from "./pages/add-model";
import UpdateModelPage from "./pages/update-model";

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
                path: "/model-applications",
                element: <AppilcationPage/>
              },
              {
                path: "/model-applications/:id",
                element: <ApplicationDetailsPage/>
              },
              {
                path: "/models",
                element: <ModelPage/>
              },
              {
                path: "*",
                element: <NotFoundPage />,
              },
              {
                path: "/models/add",
                element: <AddModelPage/>
              },
              {
                path: "/models/:id/update",
                element: <UpdateModelPage/>
              }
              
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
