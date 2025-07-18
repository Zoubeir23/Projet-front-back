import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/Global.css';
import { FournisseurAuth } from './contextes/ContexteAuth';
import { FournisseurPanier } from './contextes/ContextePanier';
import BarreNavigation from './composants/BarreNavigation';
import Accueil from './pages/Accueil';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Produits from './pages/Produits';
import DetailProduit from './pages/DetailProduit';
import Panier from './pages/Panier';
import Commande from './pages/Commande';
import Profil from './pages/Profil';
import MesCommandes from './pages/MesCommandes';
import TableauBordAdmin from './pages/TableauBordAdmin';
import RouteProtegee from './composants/RouteProtegee';

function App() {
  return (
    <FournisseurAuth>
      <FournisseurPanier>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="App">
            <BarreNavigation />
            <main>
              <Routes>
                <Route path="/" element={<Accueil />} />
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/inscription" element={<Inscription />} />
                <Route path="/produits" element={<Produits />} />
                <Route path="/produits/:id" element={<DetailProduit />} />
                <Route path="/panier" element={<Panier />} />
                <Route path="/commande" element={
                  <RouteProtegee>
                    <Commande />
                  </RouteProtegee>
                } />
                <Route path="/profil" element={
                  <RouteProtegee>
                    <Profil />
                  </RouteProtegee>
                } />
                <Route path="/mes-commandes" element={
                  <RouteProtegee>
                    <MesCommandes />
                  </RouteProtegee>
                } />
                <Route path="/admin" element={
                  <RouteProtegee adminSeulement>
                    <TableauBordAdmin />
                  </RouteProtegee>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </FournisseurPanier>
    </FournisseurAuth>
  );
}

export default App;