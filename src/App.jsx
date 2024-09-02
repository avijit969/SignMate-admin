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
import Add_learning from './pages/Add-learning';
import AdminPractice from './pages/Add-ques';
const router = createBrowserRouter([
  {
    path: "/",
    element:
      <PrivateRoute><Admin /></PrivateRoute>
    ,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/upload-video",
    element: <Add_learning />,
  },
  {
    path: "/upload-practice-question",
    element: <AdminPractice />,
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