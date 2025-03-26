import React, { useState, useEffect } from "react";
import { Card, CardMedia, CardContent, Typography, Button, Box, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useRouter } from "next/navigation";

export default function DogCard({ dog, onAdopt, onFavorite }) {
  const [isFavorited, setIsFavorited] = useState(false);
   const router = useRouter();
   useEffect(( )=>{
       const userPermissions =localStorage.getItem("userPermissions");
       console.log(userPermissions)
       if(!userPermissions){
            router.push("/"); 
       }
    },[])

  useEffect(() => {
    // Check if the dog is favorited in localStorage
    const favoriteDogs = JSON.parse(localStorage.getItem("favoriteDogs")) || [];
    const isDogFavorited = favoriteDogs.includes(dog.id);
    setIsFavorited(isDogFavorited);
  }, [dog.id]);

  // Toggle Favorite and persist in localStorage
  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    const favoriteDogs = JSON.parse(localStorage.getItem("favoriteDogs")) || [];

    if (!isFavorited) {
      favoriteDogs.push(dog.id); // Add dog to favorites
    } else {
      const index = favoriteDogs.indexOf(dog.id);
      if (index > -1) {
        favoriteDogs.splice(index, 1); // Remove dog from favorites
      }
    }

    localStorage.setItem("favoriteDogs", JSON.stringify(favoriteDogs)); // Save to localStorage
    if (onFavorite) onFavorite(dog);
  };

  if (!dog) return null;

  return (
    <Card
      sx={{
        maxWidth: 365,
        borderRadius: 4,
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
          transform: "scale(1.05)",
        },
        position: "relative",
      }}
    >
      {/* Favorite Button */}
      <Box position="absolute" top={10} right={10}>
        <IconButton
          onClick={handleFavorite}
          sx={{
            color: isFavorited ? "red" : "rgba(0, 0, 0, 0.5)",
            transition: "color 0.3s ease",
          }}
        >
          {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      {/* Dog Image */}
      <CardMedia
  component="img"
  height="220"
  image={dog.img || "/placeholder.jpg"}
  alt={dog.name}
  sx={{
    objectFit: "cover",
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)", // Adds a soft shadow effect on hover
    },
  }}
/>


      {/* Dog Details */}
      <CardContent sx={{ textAlign: "center", p: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          {dog.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
          <b>Breed:</b> {dog.breed}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
          <b>Age:</b> {dog.age} years
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          <b>Location:</b> {dog.zip_code}
        </Typography>
      </CardContent>
    </Card>
  );
}
