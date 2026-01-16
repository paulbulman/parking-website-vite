import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import amplifyConfig from './amplifyconfiguration'
import { config as FontAwesome } from "@fortawesome/fontawesome-svg-core";
import './index.css'
import App from './App.tsx'

Amplify.configure(amplifyConfig)

FontAwesome.autoAddCss = false;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
