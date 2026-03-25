import React from "react";
import Header from "../components/header/index.jsx";
import Footer from "../components/footer/index.jsx";
import PerfilUsuario from "../components/PerfilUser/index.jsx";
import useAuthRedirect from "../hooks/useAuthRedirect.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";

function PerfilUser() {
  useAuthRedirect();
  return (
    <div className="nueva-interfaz-page">
      <ScrollToTop />
      <Header />

      <PerfilUsuario className="pt-20" />
      <Footer />
    </div>
  );
}

export default PerfilUser;
