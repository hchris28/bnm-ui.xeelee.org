import React from 'react'
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import App from '../app/app';
import ProtectedRoute from '../protected-route/protected-route'
import Home from '../../routes/home/home';
import Login from '../../routes/login/login';
import Query from '../../routes/query/query';
import Receiving from '../../routes/receiving/receiving';
import Inventory from '../../routes/inventory/inventory';
import Reports from '../../routes/reports/reports';
import Upload from '../../routes/upload/upload';
import Settings from '../../routes/settings/settings';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="home" element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="query" element={<Query />} />
                        <Route path="receiving" element={<Receiving />} />
                        <Route path="inventory" element={<Inventory />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="upload" element={<Upload />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router