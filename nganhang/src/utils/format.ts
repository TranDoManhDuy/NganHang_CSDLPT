export const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  const hours = String(dateObj.getUTCHours()).padStart(2, "0");
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0"); // Tháng trong JS bắt đầu từ 0, nên cần +1
  const year = dateObj.getUTCFullYear();

  // 3. Ghép lại thành chuỗi theo định dạng mong muốn
  const formattedString: string = `${hours}:${minutes} ${day}/${month}/${year}`;
  return formattedString;
};
