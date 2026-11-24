import { useState } from 'react';

const ChangeAddress = ({ setAddress, setIsModalOpen }) => {
  const [newAddress, setNewAddress] = useState('');

  const handleSave = () => {
    const address = newAddress.trim();

    if (!address) return;

    setAddress(address);
    setIsModalOpen(false);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-[#173b32]">
      <p className="mb-1 text-sm font-bold uppercase tracking-wider text-emerald-700">
        Delivery details
      </p>
      <h2 className="mb-5 text-xl font-extrabold">Change address</h2>

      <label
        htmlFor="new-address"
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        New address
      </label>
      <textarea
        id="new-address"
        value={newAddress}
        onChange={(event) => setNewAddress(event.target.value)}
        placeholder="Enter your delivery address"
        rows={4}
        className="mb-5 w-full resize-y rounded-lg border border-gray-300 bg-[#f5f8f6] p-3 text-sm text-[#173b32] outline-none placeholder:text-gray-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!newAddress.trim()}
          className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save address
        </button>
      </div>
    </div>
  );
};

export default ChangeAddress;