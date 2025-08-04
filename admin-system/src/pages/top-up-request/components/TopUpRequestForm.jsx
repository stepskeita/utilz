import React from "react";
import TopUpRequestPaymentMethod from "./TopUpRequestPaymentMethod";
import CustomTextInput from "../../../components/generic/CustomTextInput";
import CustomTextArea from "../../../components/generic/CustomTextArea";

const TopUpRequestForm = ({ formik }) => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <TopUpRequestPaymentMethod formik={formik} />

      <div>
        <CustomTextInput
          min={"1"}
          required={true}
          id="requestedAmount"
          label="Requested Amount"
          type="number"
          placeholder="Enter the amount you want to top up"
          value={formik.values.requestedAmount}
          onChange={formik.handleChange}
          error={formik.errors.requestedAmount}
        />
      </div>

      <div>
        <CustomTextArea
          id="clientNotes"
          label="Client Notes"
          placeholder="Enter any notes or instructions for the top-up request"
          value={formik.values.clientNotes}
          onChange={formik.handleChange}
          error={formik.errors.clientNotes}
          className="h-[100px]" // Adjust height as needed
        />
      </div>

      <div>
        <CustomTextInput
          required={true}
          id="receipt"
          label="Payment Receipt"
          type="file"
          onChange={(event) => {
            formik.setFieldValue("receipt", event.currentTarget.files[0]);
          }}
          error={formik.errors.receipt}
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default TopUpRequestForm;
