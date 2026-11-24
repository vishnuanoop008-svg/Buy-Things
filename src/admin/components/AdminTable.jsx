const AdminTable = ({
  columns,
  rows,
  emptyMessage = 'No records found.',
}) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
    <table className="w-full min-w-[650px] text-left text-sm">
      <thead className="border-b border-gray-200 bg-[#f5f8f6] text-xs uppercase tracking-wide text-gray-500">
        <tr>
          {columns.map((column) => (
            <th key={column.key} scope="col" className="px-4 py-3 font-semibold">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {rows.length > 0 ? (
          rows.map((row, index) => (
            <tr
              key={row.id ?? index}
              className="text-[#173b32] transition hover:bg-[#f8faf8]"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3">
                  {column.render
                    ? column.render(row)
                    : row[column.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columns.length}
              className="px-4 py-10 text-center text-gray-500"
            >
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default AdminTable;