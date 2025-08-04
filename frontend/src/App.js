import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FournisseurAuth } from './contextes/ContexteAuth';
import { FournisseurPanier } from './contextes/ContextePanier';
import BarreNavigation from './components/BarreNavigation';
import RouteProtegee from './components/RouteProtegee';
import Accueil from './pages/Accueil';
import Produits from './pages/Produits';
import DetailProduit from './pages/DetailProduit';
import Panier from './pages/Panier';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Profil from './pages/Profil';
import Commande from './pages/Commande';
import MesCommandes from './pages/MesCommandes';
import Wishlist from './pages/Wishlist';
import './styles/Global.css';

function App() {
  return (
    <FournisseurAuth>
      <FournisseurPanier>
        <Router>
          <div className="App">
            <BarreNavigation />
            <main>
              <Routes>
                <Route path="/" element={<Accueil />} />
                <Route path="/produits" element={<Produits />} />
                <Route path="/produits/:id" element={<DetailProduit />} />
                <Route path="/panier" element={<Panier />} />
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/inscription" element={<Inscription />} />
                <Route path="/profil" element={
                  <RouteProtegee>
                    <Profil />
                  </RouteProtegee>
                } />
                <Route path="/commande" element={
                  <RouteProtegee>
                    <Commande />
                  </RouteProtegee>
                } />
                <Route path="/mes-commandes" element={
                  <RouteProtegee>
                    <MesCommandes />
                  </RouteProtegee>
                } />
                <Route path="/wishlist" element={
                  <RouteProtegee>
                    <Wishlist />
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