import "modern-normalize";
import React from "react";
import ReactDom from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./components/App/App";

const queryClient = new QueryClient();

ReactDom.createRoot(document.querySelector("#root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
