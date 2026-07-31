import "./styles/index.css";

import {
  CoreAdmin,
  CustomRoutes,
} from "ra-core";
import { Navigate, Route } from "react-router-dom";

import AccountsPage from "@pages/accounts";
import AuthPage from "@pages/auth";
import CustomersPage from "@pages/customers";
import OverviewPage from "@pages/overview";
import RolesPage from "@pages/roles";

import AdminLayout from "./layout/admin-layout";
import { authProvider } from "./providers/auth-provider";

export default function App() {
  return (
    <CoreAdmin
      authProvider={authProvider}
      requireAuth
      layout={AdminLayout}
      loginPage={AuthPage}
    >
      <CustomRoutes>
        <Route
          path="/"
          element={<Navigate to="/overview" replace />}
        />
        <Route
          path="/overview"
          element={<OverviewPage />}
        />
        <Route
          path="/accounts"
          element={<AccountsPage />}
        />
        <Route
          path="/customers"
          element={<CustomersPage />}
        />
        <Route
          path="/roles"
          element={<RolesPage />}
        />
      </CustomRoutes>
    </CoreAdmin>
  );
}
