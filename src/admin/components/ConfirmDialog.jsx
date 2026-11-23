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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md rounded-xl border border-white/10 bg-[#151519] p-6 shadow-2xl"
      >
        <h2 id="confirm-title" className="text-xl font-bold text-white">
          {title}
        </h2>
        <p className="mt-3 text-sm text-gray-300">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
          >
            {busy ? 'Working…' : 'Confirm'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmDialog;