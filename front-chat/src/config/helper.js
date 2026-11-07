
export const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);

  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 0) return "in the future";
  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;

  const years = Math.floor(days / 365);
  return `${years} years ago`;
}

// Examples
console.log(getTimeAgo(new Date(Date.now() - 60000)));
console.log(getTimeAgo("2026-11-01T10:00:00"));
