import React from 'react'
import { Navigate, Outlet } from "react-router-dom";

import { useUserContext } from '../../contexts/user-context/user-context';

const ProtectedRoute = ({ redirectPath = '/home', children }) => {

    const { user } = useUserContext();

    return (
        <>
            {user
                ? children ? children : <Outlet />
                : <Navigate to={redirectPath} replace />
            }
        </> 
    )
}

export default ProtectedRoute