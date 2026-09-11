export function getUserId(): string {
  let userId = sessionStorage.getItem("userId");
  if (!userId) {
    const randomUUID = crypto.randomUUID();
    sessionStorage.setItem("userId", randomUUID);
    userId = randomUUID;
  }
  return userId;
}
