/**
 * Utility function to generate a new user id and save it in local storage
 * @returns new UserID string
 */
export const createAndSaveUserId = () => {
  const userID = Math.random().toString(36).substring(2, 9);
  localStorage.setItem("userId", userID);
  return userID;
};
