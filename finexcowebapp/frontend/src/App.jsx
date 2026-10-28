import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/pages.css";
import BoutonWhatsApp from "./components/BoutonWhatsApp";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { FormationsProvider } from "./context/FormationsContext";
import Accueil from "./pages/Accueil";
import Connexion from "./pages/Connexion";
import FormationDetail from "./pages/FormationDetail";
import Formations from "./pages/Formations";
import Inscription from "./pages/Inscription";
import InscriptionSession from "./pages/InscriptionSession";
import PageIntrouvable from "./pages/PageIntrouvable";

/* Le site est découpé en pages. Chaque adresse (URL) affiche une page :

     /                  -> Accueil
     /formations        -> Catalogue complet
     /formations/:id    -> Fiche d'une formation
     /formations/:id/sessions/:sessionId/inscription -> S'inscrire à une session
     /connexion         -> Se connecter
     /inscription       -> Créer un compte
*/
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FormationsProvider>
          <ScrollToTop />
          <div className="site">
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
                <Route path="/inscription" element={<Inscription />} />
                <Route path="*" element={<PageIntrouvable />} />
              </Routes>
            </main>

            <Footer />
            <BoutonWhatsApp />
          </div>
        </FormationsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
