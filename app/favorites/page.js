"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


const FavoritesPage = () => {
  const [dogDetails, setDogDetails] = useState([]);
  const [selectedDogs, setSelectedDogs] = useState([]);
  const router = useRouter();
     useEffect(( )=>{
         const userPermissions =localStorage.getItem("userPermissions");
         if(!userPermissions){
              router.push("/"); 
         }
      },[])
  const fetchDogs = async (dogIds) => {
    if (dogIds.length === 0) return;

    try {
      const res = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dogIds),
      });

      if (!res.ok) throw new Error("Failed to fetch dogs");

      const data = await res.json();
      setDogDetails(data);
    } catch (error) {
      console.error("Error fetching dogs:", error);
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("favoriteDogs");
    if (data) {
      const dogIds = JSON.parse(data);
      fetchDogs(dogIds);
    }
  }, []);

  const removeFavorite = (id) => {
    const updatedFavorites = dogDetails.filter((dog) => dog.id !== id);
    setDogDetails(updatedFavorites);
    localStorage.setItem("favoriteDogs", JSON.stringify(updatedFavorites.map((dog) => dog.id)));
  };

  const toggleSelectDog = (id) => {
    setSelectedDogs((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((dogId) => dogId !== id)
        : [...prevSelected, id]
    );
  };

  const handleFindMatch = async () => {
    if (selectedDogs.length < 2) {
      alert("Select at least two dogs to find a match.");
      return;
    }

    try {
      const res = await fetch("https://frontend-take-home-service.fetch.com/dogs/match", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedDogs),
      });

      if (!res.ok) throw new Error("Failed to fetch match");

      const data = await res.json();
      router.push(`/match?matchId=${data.match}`);
    } catch (error) {
      console.error("Error finding match:", error);
    }
  };

  return (
    <Box sx={{ padding: "20px", textAlign: "center", background: "linear-gradient(135deg, #f4f4f4, #e0e0e0)", minHeight: "100vh" }}>
       <IconButton
    onClick={() => router.push("/search")} // Navigate back to the previous page
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
      <Typography variant="h4" fontWeight="bold" color="#333" gutterBottom>
        ❤️ Your Favorite Dogs
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {dogDetails.length > 0 ? (
          dogDetails.map((dog) => (
            <Grid item key={dog.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                onClick={() => toggleSelectDog(dog.id)}
                sx={{
                  maxWidth: 360,
                  borderRadius: "15px",
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(12px)",
                  boxShadow: selectedDogs.includes(dog.id)
                    ? "0px 4px 20px rgba(255, 117, 140, 0.8)"
                    : "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                  border: selectedDogs.includes(dog.id) ? "3px solid #ff758c" : "none",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={dog.img}
                    alt={dog.name}
                    sx={{ filter: "brightness(90%)", borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(dog.id);
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.7)" },
                    }}
                  >
                    <Delete sx={{ color: "red" }} />
                  </IconButton>
                </Box>
                <CardContent sx={{ textAlign: "center", padding: "15px" }}>
                  <Typography variant="h6" fontWeight="bold" color="#333">
                    {dog.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Breed:</strong> {dog.breed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Age:</strong> {dog.age} years
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Location:</strong> {dog.location}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ mt: 4, color: "black" }}>
          You haven't added any favorites yet  ...
        </Typography>
        )}
      </Grid>
      {dogDetails.length > 1 && (
        <Button
          onClick={handleFindMatch}
          variant="contained"
          sx={{
            mt: 3,
            borderRadius: "30px",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "10px 28px",
            background: "linear-gradient(135deg, #ff7eb3, #ff758c)",
            transition: "0.3s",
            "&:hover": { background: "linear-gradient(135deg, #ff758c, #ff7eb3)" },
          }}
        >
          Find Match
        </Button>
      )}
    </Box>
  );
};

export default FavoritesPage;