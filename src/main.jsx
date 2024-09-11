import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";

// i18n
import es from "./locales/es/global.json";
import en from "./locales/en/global.json";
import fr from "./locales/fr/global.json";
import ch from "./locales/ch/global.json";
import hi from "./locales/hi/global.json";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(Backend)
  .init({
    debug: true,
    lng: "es",
    fallbackLng: "es",
    resources: {
      es: {
        global: es,
      },
      en: {
        global: en,
      },
      fr: {
        global: fr,
      },
      ch: {
        global: ch,
      },
      hi: {
        global: hi,
      },
    },
  });

const queryClient = new QueryClient();

// NextUI
import { NextUIProvider, Spinner } from "@nextui-org/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <I18nextProvider i18n={i18next}>
            <React.Suspense
              fallback={
                <div className="flex items-center justify-center h-screen">
                  <Spinner
                    color="default"
                    labelColor="foreground"
                    size="lg"
                  />
                </div>
              }
            >
              <App />
            </React.Suspense>
          </I18nextProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
