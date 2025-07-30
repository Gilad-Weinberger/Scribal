/**
 * Formats a date string or Date object to dd/mm/yyyy format
 * @param date - Date string or Date object
 * @returns Formatted date string in dd/mm/yyyy format
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
