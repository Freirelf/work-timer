import { ThemeProvider  } from "styled-components";
import { defaultTheme } from "./styles/theme/default";
import { GlobalStyle } from "./styles/global";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { CyclesContextProvider } from "./context/CyclesContext";

export function App() {

  return (
    <ThemeProvider theme={defaultTheme}>

     <BrowserRouter>
      <CyclesContextProvider>
        <Router />
      </CyclesContextProvider>
     </BrowserRouter>

     <GlobalStyle />
    </ThemeProvider>

  )
}

