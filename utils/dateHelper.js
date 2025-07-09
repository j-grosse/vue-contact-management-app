export const getDaysAgo = (date) => {
    const today = new Date();
    const interactionDate = new Date(date);
    
    // Reset time part to compare only dates
    today.setHours(0, 0, 0, 0);
    interactionDate.setHours(0, 0, 0, 0);
    
    const diffTime = today - interactionDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'heute';
    if (diffDays === 1) return 'gestern';
    if (diffDays < 14) return `vor ${diffDays} Tg.`;
    if (diffDays < 30) return `vor über ${Math.floor(diffDays / 7)} Wo.`;
    if (diffDays < 365) return `vor über ${Math.floor(diffDays / 30)} Mo.`;
    return `vor über ${Math.floor(diffDays / 365)} J.`;
  };

  export const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  export const getGermanWeekday = (date) => {
  // Accepts a Date object or a date string (e.g., "2024-06-30")
  const d = new Date(date);
  const weekdays = [
    'So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'
  ];
  return weekdays[d.getDay()];
}