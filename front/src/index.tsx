import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import App from './App'; 
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import client from "./graphQl/client.ts";
import { ApolloProvider } from "@apollo/client";


createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}> 
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <App />
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>
  </ApolloProvider>
);
