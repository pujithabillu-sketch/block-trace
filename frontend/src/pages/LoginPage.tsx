import React from 'react';
import { ConnectWalletLandingPage } from './ConnectWalletLandingPage';

interface LoginPageProps {
  onNavigateToRegister?: () => void;
  onNavigateToLanding?: () => void;
  onNavigateToForgotPassword?: () => void;
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  return (
    <ConnectWalletLandingPage
      onConnectedSuccess={onLoginSuccess || (() => {})}
    />
  );
};

export default LoginPage;
