import "./accounts-page.css";

import { useQuery } from "@tanstack/react-query";
import { Columns3, Download, Plus } from "lucide-react";

import getAccounts from "../../entities/account/api/get-accounts.ts";
import type { Account } from "../../entities/account/model/types.ts";

import DataTable, {
  type DataTableColumn,
} from "@ui/data-table";

const columns: DataTableColumn<Account>[] = [
  {
    key: "id",
    header: "ID",
    render: (account) => account.id,
  },
  {
    key: "username",
    header: "Username",
    render: (account) => account.username,
  },
  {
    key: "roleName",
    header: "Role",
    render: (account) => account.roleName,
  },
  {
    key: "enabled",
    header: "Status",
    render: (account) =>
      account.enabled ? "Enabled" : "Disabled",
  },
];

export default function AccountsPage() {
  const {
    data,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => getAccounts(),
  });

  return (
    <div className="accounts-page">
      <header className="customers-page__header">
        <div>
          <p className="customers-page__eyebrow">
            Administration
          </p>

          <h1>Accounts</h1>

          <p className="customers-page__subtitle">
            Manage accounts and their roles.
          </p>
        </div>

        <div className="customers-page__actions">
          <button type="button">
            <Plus aria-hidden="true" />
            Add account
          </button>

          <details>
            <summary>
              <Columns3 aria-hidden="true" />
              Columns
            </summary>
          </details>

          <button type="button">
            <Download aria-hidden="true" />
            Export
          </button>
        </div>
      </header>

      {isError ? (
        <p role="alert">
          {error.message}
        </p>
      ) : (
        <DataTable
          columns={columns}
          data={data?.content ?? []}
          getRowKey={(account) => account.id}
          emptyMessage={
            isPending
              ? "Loading accounts..."
              : "No accounts"
          }
        />
      )}
    </div>
  );
}