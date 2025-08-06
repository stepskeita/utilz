import Swal from "sweetalert2";
import WordIcon from "./assets/icons/word.png"
import ExcelIcon from "./assets/icons/excel.png"
import PdfIcon from "./assets/icons/pdf.png"
import CsvIcon from "./assets/icons/csv.png"
import ImageIcon from "./assets/icons/image.png"
import PptIcon from "./assets/icons/powerpoint.png"
import ZipIcon from "./assets/icons/zip.png"
import TextIcon from "./assets/icons/text.png"
import VideoIcon from "./assets/icons/video.png"
import { v4 } from "uuid"


export const getFileIcon = (file) => {
  const fileName = file?.name;

  if (fileName?.includes(".pdf")) {
    return PdfIcon;
  } else if (fileName?.includes(".docx") || fileName?.includes(".doc")) {
    return WordIcon;
  } else if (fileName?.includes(".xlsx") || fileName?.includes(".xls")) {
    return ExcelIcon;
  } else if (fileName?.includes(".csv")) {
    return CsvIcon;
  } else if (fileName?.includes(".ppt") || fileName?.includes(".pptx")) {
    return PptIcon;
  } else if (fileName?.includes(".zip")) {
    return ZipIcon;
  } else if (fileName?.match(/\.(jpeg|jpg|gif|png|webp)$/)) {
    return ImageIcon;
  } else if (fileName?.match(/\.(mp4|avi|mkv)$/)) {
    return VideoIcon;
  } else return TextIcon;
};


export const getStatusBadgeOutlineColor = (status) => {
  switch (status) {
    case "new":
      return "badge-outline-primary";
    case "opened":
      return "badge-outline-purple";
    case "solved":
      return "badge-outline-success";
    case "pending":
      return "badge-outline-info";
    default:
      return "badge-outline-primary";
  }
};

export const getStatusBadgeColor = (status) => {
  switch (status) {
    case "new":
      return "badge-primary";
    case "opened":
      return "badge-purple";
    case "solved":
      return "badge-success";
    case "pending":
      return "badge-info";
    default:
      return "badge-primary";
  }
};



export const getStatusBgColor = (status) => {
  switch (status) {
    case "new":
      return "bg-primary";
    case "opened":
      return "bg-purple";
    case "solved":
      return "bg-success";
    case "pending":
      return "bg-info";
    default:
      return "bg-primary";
  }
};



export const getStatusTextColor = (status) => {
  switch (status) {
    case "new":
      return "text-primary";
    case "opened":
      return "text-purple";
    case "solved":
      return "text-success";
    case "pending":
      return "text-info";
    default:
      return "text-primary";
  }
};


export const getStatusBgOutlineColor = (status) => {
  switch (status) {
    case "new":
      return "bg-outline-primary";
    case "opened":
      return "bg-outline-purple";
    case "solved":
      return "bg-outline-success";
    case "pending":
      return "bg-outline-info";
    default:
      return "bg-outline-primary";
  }
};


export const confirmationAlert = async () => await Swal.fire({
  title: "Are you sure",
  showCancelButton: true,
  cancelButtonColor: "No",
  confirmButtonText: "Yes",
  showConfirmButton: true,
  confirmButtonColor: "#f26522",
  icon: "question"

})

export const errorSweetAlert = (message, options = {}) => {
  Swal.fire({
    icon: "error",
    title: "Oops!",
    text: message || "Server error",
    confirmButtonColor: "#f26522",
    confirmButtonText: "Okay",
    ...options

  })
}



export const uuidV4 = () => v4()

/**
 * Format currency value with proper decimal handling
 * Handles string decimals from database and converts to proper currency format
 * @param {string|number} value - The value to format
 * @param {string} currency - Currency symbol (default: 'D')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'D') => {
  if (value === null || value === undefined) {
    return `${currency}0.00`;
  }

  const numericValue = parseFloat(value);

  if (isNaN(numericValue)) {
    return `${currency}0.00`;
  }

  return `${currency}${numericValue.toFixed(2)}`;
}
