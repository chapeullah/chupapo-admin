import {
  CoreAdminContext,
  CoreAdminUI,
  type CoreAdminProps,
} from "ra-core";

import Layout from "./layout";
import AuthPage from "@pages/auth/auth-page.tsx";

export default function Admin({
                                authProvider,
                                children,
                              }: CoreAdminProps) {
  return (
    <CoreAdminContext
      authProvider={authProvider}
    >
      <CoreAdminUI
        requireAuth
        layout={Layout}
        loginPage={AuthPage}
      >
        {children}
      </CoreAdminUI>
    </CoreAdminContext>
  );
}