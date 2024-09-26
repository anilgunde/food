import "@fontsource/titillium-web";
import "@fontsource/titillium-web/400-italic.css";
import "@fontsource/titillium-web/400.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "bootstrap/dist/css/bootstrap.css";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import "./Styles/index.css";
import theme from "./Styles/style";
import Spinner from "./components/Common/Spinner";
import { persistor, store } from "./store/index.tsx";
import { getConfig } from "./utils/config";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Suspense fallback={<Spinner />}>
        <Router basename={getConfig("CONTEXT_ROOT")}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <App />
            </ThemeProvider>
          </StyledEngineProvider>
        </Router>
      </Suspense>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
