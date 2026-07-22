import "./styles/index.css";

import {
  CoreAdmin,
  CustomRoutes,
} from "ra-core";
import { Route } from "react-router-dom";

import AccountsPage from "@pages/accounts";
import AuthPage from "@pages/auth";
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
          element={<OverviewPage />}
        />
        <Route
          path="/accounts"
          element={<AccountsPage />}
        />
        <Route
          path="/roles"
          element={<RolesPage />}
        />
      </CustomRoutes>
    </CoreAdmin>
  );
}
