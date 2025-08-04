import React from "react";

const TopUpReceiptImage = ({ receiptBase64, receiptFileName }) => {
  if (!receiptBase64) return null;
  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Receipt Image</h2>
      <div className="flex flex-col items-center">
        <img
          src={receiptBase64}
          alt={receiptFileName || "Receipt"}
          className="max-w-xs max-h-80 object-contain border rounded"
        />
        <div className="mt-2 text-sm text-gray-500">{receiptFileName}</div>
      </div>
    </div>
  );
};

export default TopUpReceiptImage;
