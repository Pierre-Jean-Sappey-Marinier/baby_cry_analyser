import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutContainer,
  Header,
  Nav,
  NavLink,
  Logo,
  Main,
  Footer,
  ContentWrapper,
} from "./styles";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header>
        <Logo>
          <Link to="/">BabyCry Analyzer</Link>
        </Logo>
        <Nav>
          <NavLink>
            <Link to="/">Home</Link>
          </NavLink>
          <NavLink>
            <Link to="/analysis">Analyze</Link>
          </NavLink>
          <NavLink>
            <Link to="/history">History</Link>
          </NavLink>
        </Nav>
      </Header>

      <Main>
        <ContentWrapper>{children}</ContentWrapper>
      </Main>

      <Footer>
        <p>© 2024 BabyCry Analyzer - All rights reserved</p>
      </Footer>
    </LayoutContainer>
  );
};
