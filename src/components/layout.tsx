import {
  type CoreLayoutProps,
  useLogout,
} from "ra-core";

export default function Layout({
                                 children,
                               }: CoreLayoutProps) {
  const logout = useLogout();

  return (
    <>
      <header>
        <button
          type="button"
          onClick={() => void logout()}
        >
          Log out
        </button>
      </header>

      <main>{children}</main>
    </>
  );
}