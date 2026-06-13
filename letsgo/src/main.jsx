import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter } from 'react-router-dom';

import { RouterProvider } from 'react-router-dom';
import CreateTrip from './create-trip';
import Navbar from './components/custom/Navbar';
import ChatbotFab from './components/custom/ChatbotFab';
import BudgetSplitter from './components/custom/BudgetSplitter';
import PackingChecklist from './components/custom/PackingChecklist';
import ViewTrip from './view-trip/[tripId]';
import MyTrips from './my-trips';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Toaster />
      <ChatbotFab />
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'create-trip',
        element: <CreateTrip />,
      },
      {
        path: 'budget-splitter',
        element: <BudgetSplitter />,
      },
      {
        path: 'packing-checklist',
        element: <PackingChecklist />,
      },
      {
        path: 'view-trip/:tripId',
        element: <ViewTrip />,
      },
      {
        path: 'my-trips',
        element: <MyTrips />,
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
