export const convertToDate = (dateString: string): Date => {
  const dateParts = dateString.split("-");
  const day = parseInt(dateParts[2], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Months are zero-based in JavaScript
  const year = parseInt(dateParts[0], 10);
  const date = new Date(year, month, day);
  return date;
};