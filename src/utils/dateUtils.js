// Formats the current UTC date and time (e.g., "2025-11-07 08:35:21 UTC")
export const formatUTCDateTime = () => {
  const now = new Date();
  return now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
};

// Checks if a JWT token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const expiryTime = decodedPayload.exp * 1000;
    const now = Date.now();

    return now >= expiryTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true; // assume expired if decoding fails
  }
};
