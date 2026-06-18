export interface CustomTableColumn<TData> {
  key: keyof TData;
  header: string;
}

export interface CustomTableProps<TData extends Record<string, string | number>> {
  columns: CustomTableColumn<TData>[];
  rows: TData[];
}
