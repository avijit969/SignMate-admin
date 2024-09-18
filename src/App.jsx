import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from 'react-hot-toast';
import Admin from './pages/Admin-page';
import MainLayout from './components/MainLayout';
import ManageQues from './pages/ManageQues';
import ManageSignVideos from './pages/ManageSignVideos';
const router = createBrowserRouter([
  {
    path: "/",
    element:

      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ,
    children: [
      {
        path: '/',
        element: <Admin />
      },
      {
        path: '/upload-video',
        element: <ManageSignVideos />
      },
      {
        path: '/upload-practice-question',
        element: <ManageQues />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);
function App() {
  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <RouterProvider router={router} />
    </div>
  )
}

export default App