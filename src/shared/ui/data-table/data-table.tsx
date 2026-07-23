import type { Key, ReactNode } from "react";

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  render: (item: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (item: T) => Key;
  className?: string;
  emptyMessage?: string;
};

export default function DataTable<T>({
                                       columns,
                                       data,
                                       getRowKey,
                                       className = "",
                                       emptyMessage = "No data",
                                     }: DataTableProps<T>) {
  const tableClassName = ["data-table", className]
    .filter(Boolean)
    .join(" ");

  return (
    <table className={tableClassName}>
      <thead>
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            scope="col"
            className={column.className}
          >
            {column.header}
          </th>
        ))}
      </tr>
      </thead>

      <tbody>
      {data.length > 0 ? (
        data.map((item) => (
          <tr key={getRowKey(item)}>
            {columns.map((column) => (
              <td
                key={column.key}
                className={column.className}
              >
                {column.render(item)}
              </td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td
            className="data-table__empty"
            colSpan={columns.length}
          >
            {emptyMessage}
          </td>
        </tr>
      )}
      </tbody>
    </table>
  );
}