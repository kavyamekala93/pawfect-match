"use client"; // making this component to be a client side component to separate the logic
import React, { useEffect, useState } from "react";
import { CircularProgress, Box, Typography, Card, CardContent, CardMedia, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Confetti from "react-confetti";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";


export const MatchPerfectDog = ({matchId}) => {
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const theme = useTheme();
  const router = useRouter();

     useEffect(( )=>{
         const userPermissions =localStorage.getItem("userPermissions");
         if(!userPermissions){
              router.push("/"); 
         }
      },[])
  // Handle dynamic window size for Confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchMatchedDog = async () => {
      try {
        const res = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([matchId]),
        });

        if (!res.ok) throw new Error("Failed to fetch matched dog");

        const data = await res.json();
        setDog(data[0]);
      } catch (error) {
        console.error("Error fetching matched dog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedDog();
  }, [matchId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (!dog) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <Typography variant="h4" color="error">
          ❌ No match found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: theme.palette.background.default,
        padding: 2,
        position: "relative",
      }}
    >

      <Box sx={{ position: "absolute", top: 0, left: 0 }}>
        <IconButton
        onClick={() => router.push("/search")}
        sx={{
          position: "absolute",
          top: 15,
          left: 15,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          "&:hover": { backgroundColor: "rgba(200, 200, 200, 0.8)" },
        }}        
      >
        <ArrowBackIcon />
        </IconButton>
      </Box>


      {/* Congrats Message */}
      <Typography
        variant="h5"
        color={theme.palette.primary.main}
        fontWeight="bold"
        sx={{
          textShadow: "3px 4px 10px rgba(106, 13, 103, 0.5)",
          position: "absolute",
          top: 5,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "10px 20px",
          borderRadius: 5,
        }}
      >
        🎉 Congratulations!! You Found Your Perfect Lovely Dog!
      </Typography>

      {/* Card for Dog Information */}
      <Card
        sx={{
          maxWidth: 400,
          width: "50%",
          boxShadow: 10,
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.15)",
          },
          position: "relative",
          marginTop: 1,
        }}
      >
        <CardMedia
          component="img"
          alt={dog.name}
          height="250"
          image={dog.img || "/default-dog.jpg"}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ textAlign: "center", paddingBottom: 4 }}>
          {/* Dog Information */}
          <Typography variant="h4" color={theme.palette.text.primary} fontWeight="bold">
            {dog.name}
          </Typography>
          <Typography variant="body1" color={theme.palette.text.secondary} sx={{ marginTop: 1 }}>
            <strong>Breed:</strong> {dog.breed}
          </Typography>
          <Typography variant="body1" color={theme.palette.text.secondary} sx={{ marginTop: 1 }}>
            <strong>Age:</strong> {dog.age} years
          </Typography>
          <Typography variant="body1" color={theme.palette.text.secondary} sx={{ marginTop: 1 }}>
            <strong>Location:</strong> {dog.zip_code}
          </Typography>
        </CardContent>
      </Card>

      {/* Confetti */}
      {windowSize.width && windowSize.height && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}
    
    </Box>
  );
}