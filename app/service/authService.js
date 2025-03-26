export async function loginUser(name, email) {
  const response = await fetch("https://frontend-take-home-service.fetch.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Ensures cookies are sent and received
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null); // Handle non-JSON errors
    throw new Error(errorData?.message || "Login failed. Please check your credentials.");
  }
}
