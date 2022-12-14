import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './assets/css/index.css';
import { NotFoundPage } from './pages/404/NotFoundPage';

import "./components/test";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
