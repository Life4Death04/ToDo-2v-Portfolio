import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//React Router Imports
import { createBrowserRouter, RouterProvider } from 'react-router'
import ToDo from './components/todo/todo.tsx';
import Login from './components/auth/login.tsx';
import Register from './components/auth/register.tsx';

const router = createBrowserRouter([
  { path: '/', element: <ToDo></ToDo> },
  { path: '/user/login', element: <Login></Login>},
  { path: '/user/register', element: <Register></Register>}
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
