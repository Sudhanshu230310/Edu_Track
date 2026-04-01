export function getOrCreateUserId(): string {
  let userId = localStorage.getItem("content_analytics_user_id");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("content_analytics_user_id", userId);
  }
  return userId;
}