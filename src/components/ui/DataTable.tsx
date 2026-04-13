import { cn } from '../../utils/cn'

export interface DataTableColumn<T> {
  key: keyof T | string
  title: string
  render?: (row: T) => React.ReactNode
  className?: string
}

interface Props<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
}

export function DataTable<T>({ columns, rows, getRowKey }: Props<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="text-slate-500">
            {columns.map((column) => (
              <th key={String(column.key)} className="px-3 py-2 font-medium">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="border-t border-white/50">
              {columns.map((column) => (
                <td key={String(column.key)} className={cn('px-3 py-3 align-middle', column.className)}>
                  {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
