import { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes/AppRoutes';
import SplashScreen from './components/SplashScreen';
import './index.css';

function Root() {
  const [showSplash, setShowSplash] = useState(true);
  const handleDone = useCallback(() => setShowSplash(false), []);

  return (
    <>
      {showSplash && <SplashScreen onDone={handleDone} />}
      <AppRoutes />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
