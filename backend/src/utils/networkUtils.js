// utils/networkUtils.js

export function getNetworkCodeFromPhone(phoneNumber) {
  const firstDigit = phoneNumber?.charAt(0);

  switch (firstDigit) {
    case "6":
      return "COMIUM_GM";
    case "2":
    case "4":
    case "7":
      return "AFRICELL_GM";
    case "3":
    case "5":
      return "QCELL_GM";
    case "9":
      return "GAMCELL_GM";
    default:
      return null; // Or throw an error if you prefer strict handling
  }
}
