const ConfirmDialog = ({
  open,
  title = 'Please confirm',
  message,
  onConfirm,
  onCancel,
  busy = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-[#173b32] shadow-2xl"
      >
        <h2 id="confirm-title" className="text-xl font-extrabold">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? 'Working…' : 'Confirm'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmDialog;