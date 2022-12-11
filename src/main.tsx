import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './assets/css/index.css';
import { NotFoundPage } from './pages/404/NotFoundPage';
import { ComponentView } from './pages/component-view/ComponentView';
import { Home } from './pages/home/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/component/:componentId',
    element: <ComponentView />,
  },
  {
    path: '/*',
    element: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
