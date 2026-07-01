import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./authContext.tsx";
import Routes from "./Router.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </AuthProvider>,
);
