import { Outlet } from "react-router"

import { Main, Wrapper } from "./Layout.styles"
import Footer from "../footer/Footer"


const Layout = () => {
  return (
    <Wrapper>
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Wrapper>
  )
}

export default Layout