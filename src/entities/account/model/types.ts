export type Account = {
  id: number;
  username: string;
  roleName: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AccountsPage = {
  content: Account[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};