import React from "react";
import CustomSelectInput from "../../../components/generic/CustomSelectInput";

const TopUpRequestPaymentMethod = ({ formik }) => {
  const paymentMethods = {
    bank_transfer: () => (
      <table>
        <tbody>
          <tr>
            <td className="p-2 text-sm">Bank Name:</td>
            <td className="p-2 text-sm">ZAPP Bank </td>
          </tr>
          <tr>
            <td className="p-2 text-sm">Account Name:</td>
            <td className="p-2 text-sm">ZAPP Client Wallet</td>
          </tr>
          <tr>
            <td className="p-2 text-sm">Account Number:</td>
            <td className="p-2 text-sm">1234567890</td>
          </tr>
        </tbody>
      </table>
    ),
    mobile_money: () => (
      <table>
        <tbody>
          <tr>
            <td className="p-2 text-sm">Provider:</td>
            <td className="p-2 text-sm">ZAPP</td>
          </tr>
          <tr>
            <td className="p-2 text-sm">Account Name:</td>
            <td className="p-2 text-sm">ZAPP Client Wallet</td>
          </tr>
          <tr>
            <td className="p-2 text-sm">Account Number:</td>
            <td className="p-2 text-sm">1234567890</td>
          </tr>
        </tbody>
      </table>
    ),
    cash: () => (
      <div>
        <p className="text-sm">
          Please visit our nearest branch to make a cash deposit.
        </p>
        <p className="text-sm">
          Branch Address: 123 ZAPP Street, City, Country
        </p>
        <p className="text-sm">Contact Number: +123456789</p>
      </div>
    ),
    other: () => (
      <div>
        <p className="text-sm">
          Please upload a screenshot of your payment receipt.
        </p>
      </div>
    ),
  };
  return (
    <div>
      <CustomSelectInput
        required={true}
        id={"paymentMethod"}
        onChange={formik.handleChange}
        value={formik.values.paymentMethod}
        error={formik.errors.paymentMethod}
        placeholder={"Select Payment Method"}
        label={"Payment Method"}
        options={[
          { value: "bank_transfer", label: "Bank Transfer" },
          { value: "mobile_money", label: "Mobile Money" },
          { value: "cash", label: "Cash" },
          { value: "other", label: "Other" },
        ]}
      />

      {formik.values.paymentMethod && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Payment Method Details</h3>
          <div className="p-2 border rounded-md bg-gray-50">
            {paymentMethods[formik.values.paymentMethod]()}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopUpRequestPaymentMethod;
