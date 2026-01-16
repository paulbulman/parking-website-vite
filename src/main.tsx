import "./instrument";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import { Amplify } from "aws-amplify";
import amplifyConfig from "./amplifyconfiguration";
import { config as FontAwesome } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./index.css";
import App from "./App.tsx";

Amplify.configure(amplifyConfig);

FontAwesome.autoAddCss = false;

const root = createRoot(document.getElementById("root")!, {
  // Callback called when an error is thrown and not caught by an ErrorBoundary.
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn("Uncaught error", error, errorInfo.componentStack);
  }),
  // Callback called when React catches an error in an ErrorBoundary.
  onCaughtError: Sentry.reactErrorHandler(),
  // Callback called when React automatically recovers from errors.
  onRecoverableError: Sentry.reactErrorHandler(),
});

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
