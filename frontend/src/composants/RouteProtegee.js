import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUtiliserAuth } from '../contextes/ContexteAuth';

const RouteProtegee = ({ children, adminSeulement = false }) => {
  const { utilisateurActuel } = useUtiliserAuth();

  if (!utilisateurActuel) {
    return <Navigate to="/connexion" />;
  }

  if (adminSeulement && utilisateurActuel.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default RouteProtegee;