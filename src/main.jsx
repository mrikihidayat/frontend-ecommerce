import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { routes } from './config/routes';
import { StrictMode } from 'react';
// import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

createRoot(document.getElementById('root')).render(
  // <AuthProvider>
  //   <RouterProvider router={routes}></RouterProvider>
  // </AuthProvider>,
  <StrictMode>
    <CartProvider>
      <RouterProvider router={routes} />
    </CartProvider>
  </StrictMode>
);
