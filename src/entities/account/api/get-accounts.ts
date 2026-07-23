import { apiFetch } from "../../../shared/api/http-client.ts";

import type { AccountsPage } from "../model/types.ts";

type GetAccountsParams = {
  page?: number;
  size?: number;
  sort?: string;
};

export default async function getAccounts({
                                            page = 0,
                                            size = 10,
                                            sort = "id,asc",
                                          }: GetAccountsParams = {}): Promise<AccountsPage> {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  });

  const response = await apiFetch(
    `/api/accounts?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get accounts: ${response.status}`,
    );
  }

  return response.json();
}