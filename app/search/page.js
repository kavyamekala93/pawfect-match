"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Drawer,
  IconButton,
  LinearProgress,
  TextField,
  Pagination,
} from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import DogCard from "../components/DogCard";
import CloseIcon from '@mui/icons-material/Close';


export default function SearchPage() {
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Search term for dog name
  const [age, setAge] = useState(""); // Age filter
  const [zipCode, setZipCode] = useState(""); // Zip code filter
  const [latitude, setLatitude] = useState(""); // Latitude filter
  const [longitude, setLongitude] = useState(""); // Longitude filter
  const [city, setCity] = useState(""); // City filter
  const [state, setState] = useState(""); // State filter
  const [county, setCounty] = useState(""); // County filter
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1); // Pagination state
  const [total, setTotal] = useState(0); // Total dogs count
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error handling state
  const [sortOption, setSortOption] = useState(""); // Sorting state

  const router = useRouter();
  //component handling.....
    useEffect(( )=>{
        const userPermissions =localStorage.getItem("userPermissions");
        if(!userPermissions){
             router.push("/"); 
        }
     },[])
  // Fetch Breeds on Mount
  useEffect(() => {
    const fetchBreeds = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", {
          credentials: "include",
        });
        if (!res.ok) {
          const errorText = await res.text(); // Read response as text
          if (res.status === 401 || errorText === "Unauthorized") {
            router.push("/"); // Redirect to login if unauthorized
            return;
          } else {
            throw new Error("Failed to fetch breeds.");
          }
        }
    
        // Check if response is JSON
        const contentType = res.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const breedsData = await res.json();
          setBreeds(breedsData);
        } else {
          throw new Error("Unexpected response format.");
        }
      } catch (err) {
        console.error("Breed fetch error:", err);
        setError("Failed to load dog breeds. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBreeds();
  }, []);

  // Fetch Dogs with Applied Filters
  const fetchDogs = async () => {
    setLoading(true);
    setError("");
    try {
      let queryParams = new URLSearchParams();
      // Apply filters only if they have a value
      if (selectedBreed) queryParams.append("breeds", selectedBreed);
      if (zipCode) queryParams.append("zipCodes", zipCode);
      if (latitude) queryParams.append("latitude", latitude);
      if (longitude) queryParams.append("longitude", longitude);
      if (county) queryParams.append("county", county);
  
      const size = 12; // Number of items per page
      const from = (page - 1) * size; // Calculate offset
  
      queryParams.append("size", size);
      queryParams.append("from", from);
  
      if (sortOption) queryParams.append("sort", sortOption);
  
      // Fetch matching dog IDs
      const res = await fetch(
        `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`,
        { credentials: "include" }
      );
  
      if (!res.ok) {
        const errorText = await res.text(); // Read response as text
        if (res.status === 401 || errorText === "Unauthorized") {
          router.push("/"); // Redirect to login if unauthorized
          return;
        } else {
          throw new Error("Failed to fetch dogs.");
        }
      }
  
      // Check if response is JSON
      const contentType = res.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const { resultIds, total } = await res.json();
        setTotal(total);
  
        if (!resultIds || resultIds.length === 0) {
          setDogs([]);
          return;
        }
  
        const dogDetailsRes = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resultIds),
        });
  
        if (!dogDetailsRes.ok) {
          const errorText = await dogDetailsRes.text(); // Read response as text
          if (dogDetailsRes.status === 401 || errorText === "Unauthorized") {
            router.push("/"); // Redirect to login if unauthorized
            return;
          } else {
            throw new Error("Failed to fetch dog details.");
          }
        }
  
        const dogDetailsContentType = dogDetailsRes.headers.get("Content-Type");
        if (dogDetailsContentType && dogDetailsContentType.includes("application/json")) {
          let dogDetails = await dogDetailsRes.json();
  
          // Apply frontend filtering only on name and age
          if (searchTerm) {
            dogDetails = dogDetails.filter((dog) =>
              dog.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
  
          if (age) {
            dogDetails = dogDetails.filter((dog) => dog.age == age);
          }
  
          setDogs(dogDetails);
        } else {
          throw new Error("Unexpected response format.");
        }
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (err) {
      console.error("Error fetching dogs:", err);
      setError("Failed to load dogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchDogs();
  }, [selectedBreed, searchTerm, age, zipCode, latitude, longitude, city, state, county, page, sortOption]);

  // Load Favorites from localStorage on Mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Toggle Favorites and Store in localStorage
  const toggleFavorite = (dog) => {
    const updatedFavorites = favorites.includes(dog.id)
      ? favorites.filter((id) => id !== dog.id)
      : [...favorites, dog.id];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Save to localStorage
  };

  // Page navigation handlers
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Reset Filters handler
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedBreed("");
    setAge("");
    setZipCode("");
    setLatitude("");
    setLongitude("");
    setCity("");
    setState("");
    setCounty("");
    setSortOption(""); // Reset sorting option
    setPage(1); // Reset page to 1 on filter reset
  };

  const pageCount = Math.ceil(total / 10); // Calculate the total number of pages

  // Logout handler
  const handleLogout = () => {
    fetch("https://frontend-take-home-service.fetch.com/logout", {
      credentials: "include",
    }).then(() => {
      router.push("/"); // Redirect to login page after logout
      localStorage.setItem("userPermissions",false);
    });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        fontFamily: "'Arial', sans-serif", // Change font family
      }}
    >
  {/* Title & Controls */}
  <Box
  sx={{
    ml: filterOpen ? { xs: 0, sm: "310px" } : 0, // Adjust margin when filter is open
    mt: 3,
    transition: "margin-left 0.3s ease", // Smooth transition for margin adjustment
  }}
>
  {/* Title & Controls */}
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
    <Typography
      variant="h4"
      sx={{
        fontWeight: "bold",
        color: "#4caf50",
        fontFamily: "'Arial', sans-serif", // Ensure consistent font family
      }}
    >
      🐾 Find Your Lovely Dog
    </Typography>

    {/* View Mode Toggle & Favorites */}
    <Box>
      <IconButton onClick={() => setFilterOpen(true)} color="secondary">
        <ViewListIcon />
      </IconButton>
      <IconButton onClick={() => router.push("/favorites")} color="secondary">
        ❤️
      </IconButton>
      <Button onClick={handleLogout} color="error">Logout</Button>
    </Box>
  </Box>

  {/* Error Handling */}
  {error && (
    <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
      <Typography variant="h6" color="error">{error}</Typography>
    </Box>
  )}

  {/* Loading Indicator */}
  {loading && (
    <Box sx={{ width: "100%", mt: 1 }}>
      <LinearProgress />
    </Box>
  )}

  {/* No Data Found Message */}
  {!loading && dogs.length === 0 && !error && (
    <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
      <Typography variant="h6">No dogs found. Please try adjusting your filters.</Typography>
    </Box>
  )}

 


  {/* Sidebar for Filters */}
  <Drawer
    anchor="left"
    open={filterOpen}
    onClose={() => setFilterOpen(false)}
    variant="persistent" // Persistent drawer to keep it always visible
    sx={{
      "& .MuiDrawer-paper": {
        width: { xs: "100%", sm: "290px" }, // Fixed width for the filter
        p: 3,
        background: "rgba(255, 255, 255, 0.1)", // Light transparent white
        backdropFilter: "blur(12px)", // Strong blur effect
        borderRadius: "10px", // Smooth rounded corners
        border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle border
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow

        display: "flex",
        flexDirection: "column",
        position: "fixed", // Fixed position
        top: 0,
        height: "100vh", // Full viewport height
        zIndex: 1200,
        borderRight: "1px solid #ddd", // Border for separation
      },
    }}
  >
    {/* Close Icon at the Top */}
    <IconButton
      onClick={() => setFilterOpen(false)}
      sx={{
        position: "absolute",
        top: 10,
        left: 10,
        color: "#333",
        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
      }}
    >
      <CloseIcon />
    </IconButton>

    {/* Filter Content */}
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 5,
        gap: 2,
      }}
    >
      {/* Title */}
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#444" }}>
        🔍 Filters
      </Typography>

      {/* Filters */}
      <Box display="flex" flexDirection="column" gap={2} width="100%">
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{
            bgcolor: "white",
            borderRadius: 1,
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        />

        <FormControl fullWidth sx={{ bgcolor: "white", borderRadius: 1 }}>
          <InputLabel>Breed</InputLabel>
          <Select
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            sx={{
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              borderRadius: 1,
            }}
          >
            <MenuItem value="">All Breeds</MenuItem>
            {breeds.map((breed) => (
              <MenuItem key={breed} value={breed}>
                {breed}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Zip Code"
          variant="outlined"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          fullWidth
          sx={{
            bgcolor: "white",
            borderRadius: 1,
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        />

        <FormControl fullWidth sx={{ bgcolor: "white", borderRadius: 1 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            sx={{
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              borderRadius: 1,
            }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="name:asc">Name (A-Z)</MenuItem>
            <MenuItem value="name:desc">Name (Z-A)</MenuItem>
            <MenuItem value="age:asc">Age (Ascending)</MenuItem>
            <MenuItem value="age:desc">Age (Descending)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Age"
          variant="outlined"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          fullWidth
          sx={{
            bgcolor: "white",
            borderRadius: 1,
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        />
      </Box>
    </Box>

    {/* Reset Button at the Bottom */}
    <Box sx={{ display: "flex", justifyContent: "center", p: 2, mb: 15 }}>
      <Button
        onClick={resetFilters}
        variant="contained"
        color="secondary"
        sx={{
          borderRadius: 1,
          textTransform: "none",
          fontWeight: "bold",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          
        }}
      >
        Reset Filters
      </Button>
    </Box>
  </Drawer>

  {/* Dog List */}
  <Box
    sx={{
      mt: 3,
      transition: "margin-left 0.3s ease", // Smooth transition for margin adjustment
    }}
  >
    <Grid container spacing={filterOpen ? 2 : 3}> {/* Adjust spacing when filter is open */}
      {dogs.map((dog) => (
        <Grid
          item
          key={dog.id}
          xs={filterOpen ? 12 : viewMode === "grid" ? 6 : 12} // Compress cards when filter is open
          sm={filterOpen ? 6 : viewMode === "grid" ? 4 : 12}
          md={filterOpen ? 4 : viewMode === "grid" ? 3 : 12}
        >
          <DogCard
            dog={dog}
            isFavorite={favorites.includes(dog.id)}
            onFavoriteToggle={toggleFavorite}
            sx={{
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              overflow: "hidden",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
              },
            }}
          />
        </Grid>
      ))}
    </Grid>
  </Box>

   {/* Pagination Controls */}
   {!loading && dogs.length > 0 && (
  <Box display="flex" justifyContent="right" sx={{ mt: 3 }}>
    <Pagination
      count={pageCount}
      page={page}
      onChange={handlePageChange}
      siblingCount={1}
      boundaryCount={1}
      color="primary"
      shape="rounded"
      sx={{
        "& .MuiPaginationItem-root": {
          borderRadius: "50%", // Makes each page number circular
          width: "36px", // Adjust size
          height: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    />
  </Box>
)}

  
</Box>

  
</Container>

  );
}
