import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { SocketProvider } from "./contexts/socket.context.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <SocketProvider>
    <App />
  </SocketProvider>
  // </StrictMode>,
);
