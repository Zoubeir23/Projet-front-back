import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUtiliserAuth } from '../contextes/ContexteAuth';

const RouteProtegee = ({ children, adminSeulement = false }) => {
  const { utilisateurActuel } = useUtiliserAuth();

  if (!utilisateurActuel) {
    return <Navigate to="/connexion" replace />;
  }

  if (adminSeulement && utilisateurActuel.role !== 'admin') {
    return (
      <div className="conteneur">
        <div className="message-erreur">
          <h2>Accès refusé</h2>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default RouteProtegee;