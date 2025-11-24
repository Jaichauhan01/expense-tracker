/**
 * formatDate - converts YYYY-MM-DD to readable format 
 */
export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString();
}
