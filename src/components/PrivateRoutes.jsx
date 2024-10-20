import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import Profile from '../pages/Profile';
import SignIn from '../pages/SignIn';


export default function PrivateRoutes() {
    const { currentUser } = useSelector((state) => state.user);
  return  currentUser ? <Outlet /> : <Navigate to='sign-in' />
}
