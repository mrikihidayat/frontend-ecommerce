import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../pages/user/ErrorPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDasboard';
import RootLayout from '../rootlayout/RootLayout';
import AdminAllProductsPage from '../pages/admin/AdminAllProductsPage';
import AdminOrderDetailsPage from '../pages/admin/AdminOrderDetailsPage';
import AdminAddNewProductPage from '../pages/admin/AdminNewProductPage';
import AdminProductDetailPage from '../pages/admin/AdminProductDetailPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminAddCategoryPage from '../pages/admin/AdminAddCategoryPage';
import AdminBrandPage from '../pages/admin/AdminBrandPage';
import AdminAddBrandPage from '../pages/admin/AdminAddBrandPage';
import AdminAllUserPage from '../pages/admin/AdminAllUserPage';
import AdminEditBrandPage from '../pages/admin/AdminEditBrandPage';
import AdminEditCategoryPage from '../pages/admin/AdminEditCategoryPage';
import AdminAddUserPage from '../pages/admin/AdminAddUser';

// User Pages
import Beranda from '../pages/user/Beranda';
import Home from '../pages/user/Home';
import Login from '../pages/user/Login';
import SignUp from '../pages/user/SignUp';
import CartPage from '../pages/user/Cart';
import EditProfileForm from '../pages/user/EditProfileForm';
import ProductDetail from '../pages/user/ProductDetail';
import ForgotPassword from '../pages/user/ForgotPassword';
import BrandPage from '../pages/user/BrandPage';
import ResetPassword from '../pages/user/ResetPassword';
import MyOrder from '../pages/user/MyOrder';
import MyAddress from '../pages/user/MyAddress';
import Checkout from '../pages/user/Checkout';
import ProtectedRoute from './ProtectedRoute';

export const routes = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    children: [
      { path: '', element: <Beranda /> }, 
      { path: 'home', element: <Home /> }, 
      { path: 'login', element: <Login /> }, 
      { path: 'signup', element: <SignUp /> }, 
      { path: 'cart', element: <CartPage /> }, 
      { path: 'product/:id', element: <ProductDetail /> }, 
      { path: 'edit-profile', element: <EditProfileForm /> }, 
      { path: 'forgot-password', element: <ForgotPassword /> }, 
      { path: 'reset-password', element: <ResetPassword /> }, 
      { path: 'brand/:brandId', element: <BrandPage /> }, 
      { path: 'my-orders', element: <MyOrder /> }, 
      { path: 'my-address', element: <MyAddress /> },
      { path: 'checkout', element: <Checkout /> },
    ]
  },

  {
    path: '/dashboard',
    element: <ProtectedRoute allowedRole="admin" />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <RootLayout />,
        children: [
          { path: '', element: <AdminDashboard /> },
          { path: 'all-products', element: <AdminAllProductsPage /> },
          { path: 'order-details/:id', element: <AdminOrderDetailsPage /> },
          { path: 'add-product', element: <AdminAddNewProductPage /> },
          { path: 'product-detail/:id', element: <AdminProductDetailPage /> },
          { path: 'all-categories', element: <AdminCategoriesPage /> },
          { path: 'add-category', element: <AdminAddCategoryPage /> },
          { path: 'all-brands', element: <AdminBrandPage /> },
          { path: 'add-brand', element: <AdminAddBrandPage /> },
          { path: 'all-users', element: <AdminAllUserPage /> },
          { path: 'add-user', element: <AdminAddUserPage /> },
          { path: 'edit-brand/:id', element: <AdminEditBrandPage /> },
          { path: 'edit-category/:id', element: <AdminEditCategoryPage /> },
        ],
      },
    ],
  },
]);
