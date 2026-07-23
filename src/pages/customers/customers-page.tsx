import {
  ArrowDownAZ,
  ArrowDownUp,
  ArrowUpAZ,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Columns3,
  Download,
  Mail,
  Plus,
  Search,
  ShoppingBag,
  Tags,
  X,
} from "lucide-react";
import {
  type FormEvent,
  useMemo,
  useState,
} from "react";

import "./customers-page.css";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastSeen: string;
  newsletter: boolean;
  segments: string[];
  avatarColor: string;
};

type SortKey = "name" | "orders" | "totalSpent" | "lastSeen" | "newsletter";
type SortDirection = "asc" | "desc";
type VisitRange =
  | "any"
  | "today"
  | "this-week"
  | "last-week"
  | "this-month"
  | "last-month"
  | "earlier";
type BooleanFilter = "any" | "yes" | "no";

const segments = [
  "Compulsive",
  "Collector",
  "Ordered once",
  "Regular",
  "Returns",
  "Reviewer",
] as const;

const visitOptions: Array<{ value: VisitRange; label: string }> = [
  { value: "today", label: "Today" },
  { value: "this-week", label: "This week" },
  { value: "last-week", label: "Last week" },
  { value: "this-month", label: "This month" },
  { value: "last-month", label: "Last month" },
  { value: "earlier", label: "Earlier" },
];

const avatarColors = [
  "#5b7cfa",
  "#bd67d6",
  "#2ba58f",
  "#e27855",
  "#8a6de9",
  "#d75580",
];

const toRelativeIsoDate = (daysAgo: number, hour: number) => {
  const value = new Date();
  value.setDate(value.getDate() - daysAgo);
  value.setHours(hour, 15, 0, 0);
  return value.toISOString();
};

const initialCustomers: Customer[] = [
  { id: "1", firstName: "Amelia", lastName: "Bennett", email: "amelia@example.com", orders: 12, totalSpent: 1264.5, lastSeen: toRelativeIsoDate(0, 10), newsletter: true, segments: ["Regular", "Reviewer"], avatarColor: avatarColors[0] },
  { id: "2", firstName: "Noah", lastName: "Carter", email: "noah@example.com", orders: 3, totalSpent: 284, lastSeen: toRelativeIsoDate(1, 17), newsletter: false, segments: ["Collector"], avatarColor: avatarColors[1] },
  { id: "3", firstName: "Olivia", lastName: "Morgan", email: "olivia@example.com", orders: 8, totalSpent: 746.9, lastSeen: toRelativeIsoDate(3, 9), newsletter: true, segments: ["Compulsive", "Regular"], avatarColor: avatarColors[2] },
  { id: "4", firstName: "Liam", lastName: "Foster", email: "liam@example.com", orders: 1, totalSpent: 79, lastSeen: toRelativeIsoDate(8, 14), newsletter: true, segments: ["Ordered once"], avatarColor: avatarColors[3] },
  { id: "5", firstName: "Sophia", lastName: "Reed", email: "sophia@example.com", orders: 0, totalSpent: 0, lastSeen: toRelativeIsoDate(12, 12), newsletter: false, segments: [], avatarColor: avatarColors[4] },
  { id: "6", firstName: "Ethan", lastName: "Brooks", email: "ethan@example.com", orders: 6, totalSpent: 518.25, lastSeen: toRelativeIsoDate(17, 16), newsletter: true, segments: ["Regular"], avatarColor: avatarColors[5] },
  { id: "7", firstName: "Mia", lastName: "Hayes", email: "mia@example.com", orders: 2, totalSpent: 142.75, lastSeen: toRelativeIsoDate(25, 11), newsletter: false, segments: ["Returns"], avatarColor: avatarColors[0] },
  { id: "8", firstName: "Lucas", lastName: "Parker", email: "lucas@example.com", orders: 14, totalSpent: 1935, lastSeen: toRelativeIsoDate(35, 18), newsletter: true, segments: ["Collector", "Compulsive"], avatarColor: avatarColors[1] },
  { id: "9", firstName: "Isabella", lastName: "Turner", email: "isabella@example.com", orders: 4, totalSpent: 410.8, lastSeen: toRelativeIsoDate(47, 10), newsletter: true, segments: ["Reviewer"], avatarColor: avatarColors[2] },
  { id: "10", firstName: "James", lastName: "Cooper", email: "james@example.com", orders: 0, totalSpent: 0, lastSeen: toRelativeIsoDate(63, 13), newsletter: false, segments: [], avatarColor: avatarColors[3] },
  { id: "11", firstName: "Ava", lastName: "Richardson", email: "ava@example.com", orders: 9, totalSpent: 864.3, lastSeen: toRelativeIsoDate(75, 15), newsletter: true, segments: ["Regular", "Reviewer"], avatarColor: avatarColors[4] },
  { id: "12", firstName: "Henry", lastName: "Sullivan", email: "henry@example.com", orders: 1, totalSpent: 96.5, lastSeen: toRelativeIsoDate(94, 8), newsletter: false, segments: ["Ordered once"], avatarColor: avatarColors[5] },
  { id: "13", firstName: "Charlotte", lastName: "Ward", email: "charlotte@example.com", orders: 5, totalSpent: 635.2, lastSeen: toRelativeIsoDate(112, 19), newsletter: true, segments: ["Collector"], avatarColor: avatarColors[0] },
  { id: "14", firstName: "Leo", lastName: "Bailey", email: "leo@example.com", orders: 2, totalSpent: 188, lastSeen: toRelativeIsoDate(130, 9), newsletter: false, segments: ["Returns"], avatarColor: avatarColors[1] },
];

const dateTimeFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const startOfWeek = (date: Date) => {
  const result = startOfDay(date);
  const mondayOffset = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - mondayOffset);
  return result;
};

const startOfMonth = (date: Date) => {
  const result = startOfDay(date);
  result.setDate(1);
  return result;
};

const shiftDays = (date: Date, amount: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

const shiftMonths = (date: Date, amount: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + amount);
  return result;
};

const matchesVisitRange = (value: string, range: VisitRange) => {
  if (range === "any") return true;

  const visitedAt = new Date(value);
  const now = new Date();
  const today = startOfDay(now);
  const thisWeek = startOfWeek(now);
  const lastWeek = shiftDays(thisWeek, -7);
  const thisMonth = startOfMonth(now);
  const lastMonth = shiftMonths(thisMonth, -1);

  switch (range) {
    case "today":
      return visitedAt >= today;
    case "this-week":
      return visitedAt >= thisWeek;
    case "last-week":
      return visitedAt >= lastWeek && visitedAt < thisWeek;
    case "this-month":
      return visitedAt >= thisMonth;
    case "last-month":
      return visitedAt >= lastMonth && visitedAt < thisMonth;
    case "earlier":
      return visitedAt < lastMonth;
    default:
      return true;
  }
};

const initials = (customer: Customer) =>
  `${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}`;

const sortValue = (customer: Customer, key: SortKey) => {
  switch (key) {
    case "name":
      return `${customer.lastName} ${customer.firstName}`;
    case "orders":
      return customer.orders;
    case "totalSpent":
      return customer.totalSpent;
    case "lastSeen":
      return new Date(customer.lastSeen).getTime();
    case "newsletter":
      return Number(customer.newsletter);
  }
};

const escapeCsvCell = (value: string | number | boolean) =>
  `"${String(value).replaceAll('"', '""')}"`;

function FilterGroup({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="customers-filter-group">
      <legend>
        {icon}
        <span>{title}</span>
      </legend>
      <div className="customers-filter-group__options">{children}</div>
    </fieldset>
  );
}

function FilterOption({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="customers-filter-option">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="customers-filter-option__box">
        <Check aria-hidden="true" />
      </span>
      <span>{label}</span>
    </label>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [visitRange, setVisitRange] = useState<VisitRange>("any");
  const [hasOrdered, setHasOrdered] = useState<BooleanFilter>("any");
  const [hasNewsletter, setHasNewsletter] = useState<BooleanFilter>("any");
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("lastSeen");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    orders: true,
    totalSpent: true,
    lastSeen: true,
    newsletter: true,
    segments: true,
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return customers
      .filter((customer) => {
        const searchableValue = `${customer.firstName} ${customer.lastName} ${customer.email}`.toLowerCase();
        const matchesSearch = !normalizedSearch || searchableValue.includes(normalizedSearch);
        const matchesOrders = hasOrdered === "any"
          || (hasOrdered === "yes" ? customer.orders > 0 : customer.orders === 0);
        const matchesNewsletter = hasNewsletter === "any"
          || (hasNewsletter === "yes" ? customer.newsletter : !customer.newsletter);
        const matchesSegments = selectedSegments.length === 0
          || selectedSegments.some((segment) => customer.segments.includes(segment));

        return matchesSearch
          && matchesVisitRange(customer.lastSeen, visitRange)
          && matchesOrders
          && matchesNewsletter
          && matchesSegments;
      })
      .sort((left, right) => {
        const leftValue = sortValue(left, sortKey);
        const rightValue = sortValue(right, sortKey);
        const comparison = typeof leftValue === "string"
          ? leftValue.localeCompare(String(rightValue))
          : leftValue - Number(rightValue);

        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [customers, hasNewsletter, hasOrdered, search, selectedSegments, sortDirection, sortKey, visitRange]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleCustomers = filteredCustomers.slice((safePage - 1) * pageSize, safePage * pageSize);
  const allVisibleSelected = visibleCustomers.length > 0
    && visibleCustomers.every((customer) => selectedIds.includes(customer.id));
  const resultStart = filteredCustomers.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const resultEnd = Math.min(safePage * pageSize, filteredCustomers.length);

  const chooseVisitRange = (value: VisitRange) => {
    setVisitRange((current) => current === value ? "any" : value);
    setPage(1);
  };

  const chooseBooleanFilter = (
    setter: React.Dispatch<React.SetStateAction<BooleanFilter>>,
    value: Exclude<BooleanFilter, "any">,
  ) => {
    setter((current) => current === value ? "any" : value);
    setPage(1);
  };

  const toggleSegment = (segment: string) => {
    setSelectedSegments((current) => current.includes(segment)
      ? current.filter((item) => item !== segment)
      : [...current, segment]);
    setPage(1);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowDownUp aria-hidden="true" />;
    return sortDirection === "asc"
      ? <ArrowDownAZ aria-hidden="true" />
      : <ArrowUpAZ aria-hidden="true" />;
  };

  const toggleCustomer = (id: string) => {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]);
  };

  const toggleVisibleCustomers = () => {
    const visibleIds = visibleCustomers.map((customer) => customer.id);
    setSelectedIds((current) => allVisibleSelected
      ? current.filter((id) => !visibleIds.includes(id))
      : Array.from(new Set([...current, ...visibleIds])));
  };

  const exportCustomers = () => {
    const header = ["Name", "Email", "Orders", "Total spent", "Last seen", "Newsletter", "Segments"];
    const rows = filteredCustomers.map((customer) => [
      `${customer.firstName} ${customer.lastName}`,
      customer.email,
      customer.orders,
      customer.totalSpent,
      customer.lastSeen,
      customer.newsletter,
      customer.segments.join(", "),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map(escapeCsvCell).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "customers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const createCustomer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const firstName = String(form.get("firstName") ?? "").trim();
    const lastName = String(form.get("lastName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const newsletter = form.get("newsletter") === "on";

    if (!firstName || !lastName || !email) return;

    setCustomers((current) => [{
      id: crypto.randomUUID(),
      firstName,
      lastName,
      email,
      orders: 0,
      totalSpent: 0,
      lastSeen: new Date().toISOString(),
      newsletter,
      segments: [],
      avatarColor: avatarColors[current.length % avatarColors.length],
    }, ...current]);
    setIsCreateOpen(false);
    setPage(1);
    event.currentTarget.reset();
  };

  const clearFilters = () => {
    setSearch("");
    setVisitRange("any");
    setHasOrdered("any");
    setHasNewsletter("any");
    setSelectedSegments([]);
    setPage(1);
  };

  const filtersAreActive = Boolean(search)
    || visitRange !== "any"
    || hasOrdered !== "any"
    || hasNewsletter !== "any"
    || selectedSegments.length > 0;

  return (
    <section className="customers-page">
      <header className="customers-page__header">
        <div>
          <p className="customers-page__eyebrow">Sales</p>
          <h1>Customers</h1>
          <p className="customers-page__subtitle">
            Manage customer details, activity and segments.
          </p>
        </div>

        <div className="customers-page__actions">
          <button className="customers-button customers-button--primary" type="button" onClick={() => setIsCreateOpen(true)}>
            <Plus aria-hidden="true" />
            Add customer
          </button>

          <details className="customers-columns">
            <summary className="customers-button customers-button--secondary">
              <Columns3 aria-hidden="true" />
              Columns
            </summary>
            <div className="customers-columns__menu">
              {Object.entries(visibleColumns).map(([key, visible]) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={() => setVisibleColumns((current) => ({
                      ...current,
                      [key]: !current[key as keyof typeof current],
                    }))}
                  />
                  <span>{key === "totalSpent" ? "Total spent" : key.charAt(0).toUpperCase() + key.slice(1)}</span>
                </label>
              ))}
            </div>
          </details>

          <button className="customers-button customers-button--secondary" type="button" onClick={exportCustomers}>
            <Download aria-hidden="true" />
            Export
          </button>
        </div>
      </header>

      <div className="customers-page__body">
        <aside className="customers-filters" aria-label="Customer filters">
          <div className="customers-search">
            <Search aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search customers"
              aria-label="Search customers"
            />
          </div>

          <FilterGroup icon={<Clock3 aria-hidden="true" />} title="Last visited">
            {visitOptions.map((option) => (
              <FilterOption
                key={option.value}
                checked={visitRange === option.value}
                label={option.label}
                onChange={() => chooseVisitRange(option.value)}
              />
            ))}
          </FilterGroup>

          <FilterGroup icon={<ShoppingBag aria-hidden="true" />} title="Has ordered">
            <FilterOption checked={hasOrdered === "yes"} label="Yes" onChange={() => chooseBooleanFilter(setHasOrdered, "yes")} />
            <FilterOption checked={hasOrdered === "no"} label="No" onChange={() => chooseBooleanFilter(setHasOrdered, "no")} />
          </FilterGroup>

          <FilterGroup icon={<Mail aria-hidden="true" />} title="Has newsletter">
            <FilterOption checked={hasNewsletter === "yes"} label="Yes" onChange={() => chooseBooleanFilter(setHasNewsletter, "yes")} />
            <FilterOption checked={hasNewsletter === "no"} label="No" onChange={() => chooseBooleanFilter(setHasNewsletter, "no")} />
          </FilterGroup>

          <FilterGroup icon={<Tags aria-hidden="true" />} title="Segment">
            {segments.map((segment) => (
              <FilterOption
                key={segment}
                checked={selectedSegments.includes(segment)}
                label={segment}
                onChange={() => toggleSegment(segment)}
              />
            ))}
          </FilterGroup>

          {filtersAreActive && (
            <button className="customers-filters__clear" type="button" onClick={clearFilters}>
              <X aria-hidden="true" />
              Clear filters
            </button>
          )}
        </aside>

        <div className="customers-table-card">
          {selectedIds.length > 0 && (
            <div className="customers-selection-bar">
              <strong>{selectedIds.length} selected</strong>
              <button type="button" onClick={() => setSelectedIds([])}>Clear selection</button>
            </div>
          )}

          <div className="customers-table-scroll">
            <table className="customers-table">
              <thead>
                <tr>
                  <th className="customers-table__select">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleVisibleCustomers}
                      aria-label="Select visible customers"
                    />
                  </th>
                  <th>
                    <button type="button" onClick={() => toggleSort("name")}>Name {sortIcon("name")}</button>
                  </th>
                  {visibleColumns.orders && (
                    <th className="customers-table__number">
                      <button type="button" onClick={() => toggleSort("orders")}>Orders {sortIcon("orders")}</button>
                    </th>
                  )}
                  {visibleColumns.totalSpent && (
                    <th className="customers-table__number">
                      <button type="button" onClick={() => toggleSort("totalSpent")}>Total spent {sortIcon("totalSpent")}</button>
                    </th>
                  )}
                  {visibleColumns.lastSeen && (
                    <th>
                      <button type="button" onClick={() => toggleSort("lastSeen")}>Last seen {sortIcon("lastSeen")}</button>
                    </th>
                  )}
                  {visibleColumns.newsletter && (
                    <th>
                      <button type="button" onClick={() => toggleSort("newsletter")}>Newsletter {sortIcon("newsletter")}</button>
                    </th>
                  )}
                  {visibleColumns.segments && <th>Segments</th>}
                </tr>
              </thead>
              <tbody>
                {visibleCustomers.map((customer) => (
                  <tr key={customer.id} className={selectedIds.includes(customer.id) ? "customers-table__row--selected" : undefined}>
                    <td className="customers-table__select">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(customer.id)}
                        onChange={() => toggleCustomer(customer.id)}
                        aria-label={`Select ${customer.firstName} ${customer.lastName}`}
                      />
                    </td>
                    <td>
                      <div className="customers-person">
                        <span className="customers-person__avatar" style={{ backgroundColor: customer.avatarColor }}>
                          {initials(customer)}
                        </span>
                        <span className="customers-person__copy">
                          <strong>{customer.firstName} {customer.lastName}</strong>
                          <small>{customer.email}</small>
                        </span>
                      </div>
                    </td>
                    {visibleColumns.orders && <td className="customers-table__number">{customer.orders || "—"}</td>}
                    {visibleColumns.totalSpent && (
                      <td className={`customers-table__number${customer.totalSpent > 500 ? " customers-table__spend--high" : ""}`}>
                        {currencyFormatter.format(customer.totalSpent)}
                      </td>
                    )}
                    {visibleColumns.lastSeen && <td className="customers-table__date">{dateTimeFormatter.format(new Date(customer.lastSeen))}</td>}
                    {visibleColumns.newsletter && (
                      <td>
                        <span className={`customers-status customers-status--${customer.newsletter ? "yes" : "no"}`}>
                          {customer.newsletter ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
                          {customer.newsletter ? "Yes" : "No"}
                        </span>
                      </td>
                    )}
                    {visibleColumns.segments && (
                      <td>
                        <div className="customers-segments">
                          {customer.segments.length > 0
                            ? customer.segments.map((segment) => <span key={segment}>{segment}</span>)
                            : <span className="customers-segments__empty">No segment</span>}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {visibleCustomers.length === 0 && (
              <div className="customers-empty-state">
                <Search aria-hidden="true" />
                <strong>No customers found</strong>
                <span>Try changing or clearing the filters.</span>
                <button type="button" onClick={clearFilters}>Clear filters</button>
              </div>
            )}
          </div>

          <footer className="customers-pagination">
            <div className="customers-pagination__size">
              <label htmlFor="customers-page-size">Rows per page</label>
              <select
                id="customers-page-size"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
            <span>{resultStart}–{resultEnd} of {filteredCustomers.length}</span>
            <div className="customers-pagination__buttons">
              <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage === 1} aria-label="Previous page">
                <ChevronLeft aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={safePage === totalPages} aria-label="Next page">
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          </footer>
        </div>
      </div>

      {isCreateOpen && (
        <div className="customers-dialog-backdrop" role="presentation" onMouseDown={() => setIsCreateOpen(false)}>
          <section className="customers-dialog" role="dialog" aria-modal="true" aria-labelledby="create-customer-title" onMouseDown={(event) => event.stopPropagation()}>
            <header>
              <div>
                <p className="customers-page__eyebrow">New record</p>
                <h2 id="create-customer-title">Add customer</h2>
              </div>
              <button type="button" onClick={() => setIsCreateOpen(false)} aria-label="Close dialog"><X aria-hidden="true" /></button>
            </header>
            <form onSubmit={createCustomer}>
              <label>
                First name
                <input name="firstName" required autoFocus />
              </label>
              <label>
                Last name
                <input name="lastName" required />
              </label>
              <label className="customers-dialog__wide">
                Email
                <input name="email" type="email" required />
              </label>
              <label className="customers-dialog__newsletter">
                <input name="newsletter" type="checkbox" />
                Subscribe to newsletter
              </label>
              <div className="customers-dialog__actions">
                <button className="customers-button customers-button--secondary" type="button" onClick={() => setIsCreateOpen(false)}>Cancel</button>
                <button className="customers-button customers-button--primary" type="submit">Add customer</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
