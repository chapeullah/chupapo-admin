import {
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const AuthPage = lazy(() => import("@pages/auth"));
const NotFoundPage = lazy(() => import("@pages/not-found"));

interface LazyPageProps {
  component: LazyExoticComponent<ComponentType>;
}

function LazyPage({ component: Page }: LazyPageProps) {
  return (
      <Suspense fallback={null}>
        <Page />
      </Suspense>
  );
}

export default function Router() {
  return (
      <BrowserRouter>
        <Routes>
          <Route
              path="/auth"
              element={<LazyPage component={AuthPage} />}
          />

          <Route
              path="*"
              element={<LazyPage component={NotFoundPage} />}
          />
        </Routes>
      </BrowserRouter>
  );
}