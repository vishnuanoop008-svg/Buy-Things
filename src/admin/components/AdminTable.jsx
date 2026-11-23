const AdminTable = ({ columns, rows, emptyMessage = 'No records found.' }) => (
  <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#111114]">
    <table className="w-full min-w-[650px] text-left text-sm">
      <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wide text-gray-400">
        <tr>
          {columns.map(column => (
            <th key={column.key} className="px-4 py-3">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-white/10">
        {rows.length ? (
          rows.map((row, index) => (
            <tr key={row.id ?? index} className="text-gray-200">
              {columns.map(column => (
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
              className="px-4 py-10 text-center text-gray-400"
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