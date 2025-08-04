import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Modal } from "react-responsive-modal";
import { twMerge } from "tailwind-merge";

const CustomModal = ({
  title,
  isOpen,
  setIsOpen,
  children,
  className,
  formik,
  ...props
}) => {
  return (
    <Modal
      open={isOpen}
      onOverlayClick={() => {
        if (formik) {
          formik.resetForm();
        }
        setIsOpen(false);
      }}
      onClose={() => {
        if (formik) {
          formik.resetForm();
        }
        setIsOpen(false);
      }}
      center
      styles={{
        modalContainer: {
          padding: 0,
          // margin: "auto",
          overflow: "hidden",
          width: "100%",
          height: "100%",
          // maxWidth: "fit-content",
        },
        modal: {
          padding: 0,
          margin: "auto",
          overflow: "hidden",
          maxWidth: "fit-content",
        },
        root: {
          padding: 0,
          margin: "auto",
          overflow: "hidden",
          // maxWidth: "fit-content",
        },
      }}
      showCloseIcon={false}
      {...props}
    >
      <div className={twMerge("p-0 rounded-md overflow-hidden", className)}>
        <div className="w-full h-full flex flex-col p-0 m-0 overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between bg-primary/5 p-2">
            <div>{title && <h2 className="font-semibold">{title}</h2>}</div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-[30px] h-[30px] flex items-center justify-center border border-primary text-primary hover:text-white hover:bg-primary rounded-md transition-all duration-300"
            >
              <AiOutlineClose />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">{children}</div>

          {/* footer */}
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
