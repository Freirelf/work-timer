import { HeaderContainer } from "./style";
import { Timer, Scroll} from "phosphor-react"
import { NavLink } from "react-router-dom";

import logo from "../../assets/logo.svg"

export function Header(){
  return (
    <HeaderContainer>
      <img src={logo} alt="Escudo com uma ampulheta do tempo centralizada ao meio" />
      <nav>
        <NavLink to="/" title="Timer">
          <Timer size={24}/>
        </NavLink>
        <NavLink to="/history" title="Histórico">
          <Scroll size={24}/>
        </NavLink>
      </nav>
      
    </HeaderContainer>
  )
}