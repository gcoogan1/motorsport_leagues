import { Outlet } from "react-router"

import { Main, Wrapper } from "./Layout.styles"
import Footer from "../Footer/Footer"
import Navbar from "../Navbar/Navbar"


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