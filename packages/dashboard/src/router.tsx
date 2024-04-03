import { Navigate, createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/login";
import NotFoundPage from "./pages/not-found";
import ProtectedRoute from "./components/globals/ProtectedRoute";
import CalendarPage from "./pages/calendar";
import PrimaryLayout from "./components/layouts/PrimaryLayout";
import InitAppAsync from "./components/globals/InitApp";
import ViewStaffPage from "./pages/view-staff";
import ApplicationSubmissionPage from "./pages/model-application-submission";
import AppilcationPage from "./pages/AppilcationPage";
import ApplicationDetailsPage from "./pages/application-details";
import ModelPage from "./pages/view-model";
import AddModelPage from "./pages/add-model";
import UpdateModelPage from "./pages/update-model";
import AddJobPage from "./pages/add-job";
import ViewJobPage from "./pages/view-job";
import UpdateJobPage from "./pages/update-job";
import NavbarLayout from "./components/layouts/NavBarLayout";
import { CalendarContextProvider } from "./components/calendar/context";
import ModelProfilePage from "./pages/model-profile";

const router = createBrowserRouter([
  {
    element: <InitAppAsync/>,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute/>,
        children: [
          {
            element: <NavbarLayout/>,
            children: [
              {
                path: "/calendar",
                element: <CalendarContextProvider>
                  <CalendarPage/>
                </CalendarContextProvider>,

              }
            ]
          },
          {
            path: "/",
           element: <Navigate to={"/calendar"}/>
            
          },

          {
            element: <PrimaryLayout/>,
            children: [
              // {
              //   path: "/",
              //   element: <CalendarPage/>
              // },
              {
                path: "/staffs",
                element: <ViewStaffPage/>
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
              },
              {
                path: "/models/:id",
                element: <ModelProfilePage/>
              },
              {
                path: "jobs/add",
                element: <AddJobPage/>
              },
              {
                path: "/jobs",
                element: <ViewJobPage/>
              },
              {
                path: "jobs/:id/update",
                element: <UpdateJobPage/>
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
