import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import type React from 'react';

export default function PublicRoute({
  children
}: {
  children: React.ReactElement;
}) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
