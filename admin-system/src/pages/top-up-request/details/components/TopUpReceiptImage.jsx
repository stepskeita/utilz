import React from "react";
import CustomCard from "../../../../components/generic/CustomCard";
import Fancybox from "./FancyBox";

const TopUpReceiptImage = ({ receiptBase64, receiptFileName }) => {
  if (!receiptBase64) return null;
  return (
    <CustomCard className="bg-white rounded shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Receipt Image</h2>
      <div className="flex flex-col items-center">
        <Fancybox
          options={{
            Carousel: {
              infinite: false,
            },
          }}
        >
          <a href={receiptBase64} data-fancybox data-caption="Receipt Image">
            <img
              src={receiptBase64}
              alt={receiptFileName || "Receipt"}
              className="max-w-xs max-h-80 object-contain border rounded"
            />
          </a>
        </Fancybox>
        <div className="mt-2 text-sm text-gray-500">{receiptFileName}</div>
      </div>
    </CustomCard>
  );
};

export default TopUpReceiptImage;
