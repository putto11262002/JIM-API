import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import router from "./router.tsx";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {Provider} from "react-redux"
import {store} from "./redux/store"
import { Toaster } from "@/components/ui/toaster"



const queryClient = new QueryClient({});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
   <Provider store={store}>
    <Toaster/>
   <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
   </Provider>
  </React.StrictMode>
);
