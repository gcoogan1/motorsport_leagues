import { Outlet } from "react-router"

import { Main, Wrapper } from "./Layout.styles"
import Footer from "../footer/Footer"
import Navbar from "../navbar/Navbar"


const Layout = () => {
  return (
    <Wrapper>
      <Navbar />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Wrapper>
  )
}

export default Layout