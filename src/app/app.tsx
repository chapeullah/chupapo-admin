import "./styles/index.css";

import { CustomRoutes } from "ra-core";
import { Route } from "react-router";

import Admin from "@components/admin";
import DashboardPage from "@components/dashboard-page";

import { authProvider } from "@components/auth-provider";

export default function App() {
  return (
    <Admin authProvider={authProvider}>
      <CustomRoutes>
        <Route
          path="/"
          element={<DashboardPage />}
        />
      </CustomRoutes>
    </Admin>
  );
}