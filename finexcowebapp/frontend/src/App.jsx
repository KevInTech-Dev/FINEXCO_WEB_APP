import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import "./styles/pages.css";
import BoutonWhatsApp from "./components/BoutonWhatsApp";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FormationsProvider } from "./context/FormationsContext";
import Accueil from "./pages/Accueil";
import Admin from "./pages/Admin";
import Connexion from "./pages/Connexion";
import FormationDetail from "./pages/FormationDetail";
import Formations from "./pages/Formations";
import Inscription from "./pages/Inscription";
import InscriptionSession from "./pages/InscriptionSession";
import PageIntrouvable from "./pages/PageIntrouvable";
import Profil from "./pages/Profil";
import PremiereConnexion from "./pages/PremiereConnexion";

/* Le site est découpé en pages. Chaque adresse (URL) affiche une page :

     /                  -> Accueil
     /formations        -> Catalogue complet
     /formations/:id    -> Fiche d'une formation
     /formations/:id/sessions/:sessionId/inscription -> S'inscrire à une session
     /connexion         -> Se connecter
     /premiere-connexion -> Choisir son mot de passe formateur
     /inscription       -> Créer un compte
*/
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FormationsProvider>
          <ScrollToTop />
          <div className="site">
            <ContenuApplication />
          </div>
        </FormationsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function ContenuApplication() {
  const { utilisateur, chargement } = useAuth();
  const location = useLocation();

  if (
    !chargement &&
    utilisateur?.doit_changer_mot_de_passe &&
    location.pathname !== "/premiere-connexion"
  ) {
    return <Navigate to="/premiere-connexion" replace />;
  }
  if (
    !chargement &&
    utilisateur &&
    !utilisateur.doit_changer_mot_de_passe &&
    location.pathname === "/premiere-connexion"
  ) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/formations/:id" element={<FormationDetail />} />
          <Route
            path="/formations/:id/sessions/:sessionId/inscription"
            element={<InscriptionSession />}
          />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/premiere-connexion" element={<PremiereConnexion />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="*" element={<PageIntrouvable />} />
        </Routes>
      </main>
      <Footer />
      <BoutonWhatsApp />
    </>
  );
}

export default App;
