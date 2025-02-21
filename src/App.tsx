import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Home } from "./pages/Home/Home";
import { Analysis } from "./pages/Analysis/Analysis";
// import { History } from "./pages/History/History";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
          {/* <Route path="/history" element={<History />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
