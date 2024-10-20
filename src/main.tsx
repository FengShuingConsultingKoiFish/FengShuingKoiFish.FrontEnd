import { StrictMode } from "react"

import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import App from "./App.tsx"
import "./index.css"
import { Provider } from "react-redux"
import store, { persistor } from "./lib/redux/store.tsx"
import { PersistGate } from "redux-persist/integration/react"

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    </PersistGate>
  </Provider>
)
