import styles from './CustomTable.module.scss';
import { useCustomTable } from './useCustomTable';
import type { CustomTableProps } from './CustomTable.types';

export function CustomTable<TData extends { id?: string | number } & Record<string, string | number>>({ columns, rows }: CustomTableProps<TData>) {
  const { hasRows } = useCustomTable(rows);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {hasRows
          ? rows.map((row) => (
              <tr key={row.id ?? JSON.stringify(row)}>
                {columns.map((column) => (
                  <td key={String(column.key)}>{String(row[column.key])}</td>
                ))}
              </tr>
            ))
          : (
            <tr>
              <td colSpan={columns.length}>No data found</td>
            </tr>
          )}
      </tbody>
    </table>
  );
}
