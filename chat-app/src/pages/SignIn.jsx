"use client"

import React, { useState } from "react"
import axios from "axios"
import api from "../api"
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  FormLabel,
  FormControl,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
  Alert,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import AppTheme from "../shared-theme/AppTheme"
import { useNavigate } from "react-router-dom"

axios.defaults.baseURL = "/api"
axios.defaults.withCredentials = true

// Updated Card with dark theme styling
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  backgroundColor: "#0f1219", // Darker background for the card
  color: "#ffffff", // Light text color
  border: "1px solid rgba(255, 255, 255, 0.1)", // Subtle border
  boxShadow: "rgba(0, 0, 0, 0.3) 0px 5px 15px 0px, rgba(0, 0, 0, 0.2) 0px 15px 35px -5px",
}))

// Updated container with dark theme styling
const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "100vh",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  backgroundColor: "#0a0d14", // Dark navy/black background
  backgroundImage: "none", // Remove the radial gradient
  backgroundRepeat: "no-repeat",
}))

// Custom styled TextField for dark theme
const DarkTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#0a0d14", // Dark input background
    color: "#ffffff", // Light text color
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.1)", // Subtle border
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.2)", // Slightly brighter on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3b82f6", // Blue accent color when focused
    },
  },
  "& .MuiInputLabel-root": {
    color: "#d1d5db", // Light gray label
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#6b7280", // Darker gray for placeholder
    opacity: 1,
  },
}))

// Custom styled FormLabel for dark theme
const DarkFormLabel = styled(FormLabel)(({ theme }) => ({
  color: "#d1d5db", // Light gray label
  marginBottom: theme.spacing(0.5),
}))

// Custom styled Checkbox for dark theme
const DarkCheckbox = styled(Checkbox)(({ theme }) => ({
  color: "#d1d5db", // Light gray when unchecked
  "&.Mui-checked": {
    color: "#3b82f6", // Blue accent color when checked
  },
}))

// Custom styled Button for dark theme
const DarkButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#3b82f6", // Blue accent color
  color: "#ffffff", // White text
  "&:hover": {
    backgroundColor: "#2563eb", // Darker blue on hover
  },
  "&.Mui-disabled": {
    backgroundColor: "rgba(59, 130, 246, 0.5)", // Faded blue when disabled
    color: "rgba(255, 255, 255, 0.7)", // Slightly faded text
  },
}))

const SignIn = (props) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const validateInputs = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.")
      return false
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return false
    }
    setError("")
    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateInputs()) return

    try {
      setIsLoading(true)
      // Use api instead of axios
      const response = await api.post("/login", {
        username: email,
        password: password,
      })

      if (response.data.message === "Login successful") {
        // Check if the user is an admin and redirect accordingly
        if (response.data.is_admin) {
          navigate("/admin")
        } else {
          navigate("/dashboard")
        }
      } else {
        setError("Invalid credentials")
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Add global styles for dark theme
  React.useEffect(() => {
    const styleTag = document.createElement("style")
    styleTag.type = "text/css"
    styleTag.innerHTML = `
      body {
        background-color: #0a0d14;
        margin: 0;
        padding: 0;
        color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      
      /* Custom scrollbar for dark theme */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: #0a0d14;
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #1f2937;
        border-radius: 10px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #374151;
      }
    `
    document.head.appendChild(styleTag)

    return () => {
      if (document.head.contains(styleTag)) {
        document.head.removeChild(styleTag)
      }
    }
  }, [])

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              color: "#ffffff", // Ensure white text
              fontWeight: 600, // Make it slightly bolder
            }}
          >
            Sign in
          </Typography>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                backgroundColor: "rgba(239, 68, 68, 0.1)", // Subtle red background
                color: "#f87171", // Light red text
                border: "1px solid rgba(239, 68, 68, 0.2)", // Subtle red border
                "& .MuiAlert-icon": {
                  color: "#f87171", // Light red icon
                },
              }}
            >
              {error}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <DarkFormLabel htmlFor="email">Email</DarkFormLabel>
              <DarkTextField
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <DarkFormLabel htmlFor="password">Password</DarkFormLabel>
              <DarkTextField
                id="password"
                type="password"
                name="password"
                placeholder="••••••"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControlLabel
              control={<DarkCheckbox value="remember" />}
              label="Remember me"
              sx={{ color: "#d1d5db" }} // Light gray text for the label
            />

            <DarkButton type="submit" fullWidth variant="contained" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign in"}
            </DarkButton>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  )
}

export default SignIn
