"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "./service/authService"; // Correct path to authService
import { Container, TextField, Button, Typography, Card, CardContent, Box, CircularProgress, Alert } from "@mui/material";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginUser(name, email); // Call loginUser function
      router.push("/search"); // Redirect to Dog Search page
      localStorage.setItem("userPermissions",true);
    } catch (err) {
      setError(err.message); // Set error message on failed login
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Card sx={{ mt: 10, p: 4, boxShadow: 5, borderRadius: 4, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
            🐶 Pawfect Match Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Box textAlign="center" mt={3}>
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ py: 1.5 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
