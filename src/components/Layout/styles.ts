import styled from "styled-components";

export const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;

  a {
    color: white;
    text-decoration: none;

    &:hover {
      color: #3498db;
    }
  }
`;

export const Nav = styled.nav`
  display: flex;
  gap: 2rem;
`;

export const NavLink = styled.div`
  a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #34495e;
      color: #3498db;
    }
  }
`;

export const Main = styled.main`
  flex: 1;
  background-color: #f5f6fa;
  padding: 2rem;
`;

export const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const Footer = styled.footer`
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;

  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;
