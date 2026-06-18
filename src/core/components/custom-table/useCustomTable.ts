export function useCustomTable<TData>(rows: TData[]) {
  return {
    hasRows: rows.length > 0,
  };
}
