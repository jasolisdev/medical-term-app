import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  FormErrorMessage,
  Grid,
  GridItem,
  HStack,
  Circle,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    pin: "",
  });
  const [errors, setErrors] = useState({});
  const [usePin, setUsePin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [flashError, setFlashError] = useState(false); // State for flashing red circles
  const { login } = useAuth(); // Get login function from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePinInput = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      pin: prevData.pin.length < 4 ? prevData.pin + value : prevData.pin,
    }));
  };

  useEffect(() => {
    if (usePin && formData.pin.length === 4) {
      handleSubmit();
    }
  }, [formData.pin]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrors({});

    try {
      const res = await axios.post(
        "/api/login",
        usePin ? { username: formData.username, pin: formData.pin } : formData,
      );
      login(res.data.token); // Set authentication and save token
    } catch (error) {
      const errorMsg =
        error.response?.data?.msg || "Incorrect credentials, please try again";

      // Set the error and clear PIN input if using PIN
      setErrors({ form: errorMsg });
      if (usePin) {
        setFormData((prevData) => ({
          ...prevData,
          pin: "",
        }));
        setFlashError(true); // Trigger the flash animation effect

        // Remove flash effect after 500ms
        setTimeout(() => {
          setFlashError(false);
        }, 500);
      }
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="8" p="8" borderWidth="1px" borderRadius="lg">
      <Heading mb="6">Login</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing="4">
          {!usePin ? (
            <>
              <FormControl isInvalid={errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  isRequired
                />
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    isRequired
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
            </>
          ) : (
            <>
              <FormControl isInvalid={errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  isRequired
                />
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.pin}>
                <FormLabel>Enter PIN</FormLabel>
                <HStack
                  spacing="4"
                  justifyContent="center"
                  mb="4"
                  className={flashError ? "flash-error" : ""}
                >
                  {[...Array(4)].map((_, idx) => (
                    <Circle
                      key={idx}
                      size="10px"
                      bg={
                        flashError
                          ? "red.500" // The color of the flashing circles when there's an error
                          : formData.pin.length > idx
                            ? "teal"
                            : "gray.300"
                      }
                      transition="background-color 0.3s"
                    />
                  ))}
                </HStack>
                <FormErrorMessage>{errors.pin}</FormErrorMessage>
              </FormControl>

              <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={4}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0].map((value, index) => (
                  <GridItem key={index}>
                    {value !== "" ? (
                      <Button
                        colorScheme="teal"
                        onClick={() => handlePinInput(value)}
                        width="70px" // Adjusted for circular shape
                        height="70px" // Adjusted for circular shape
                        borderRadius="full" // Make buttons circular
                        fontSize="2xl" // Increased font size for better visibility
                      >
                        {value}
                      </Button>
                    ) : (
                      <Box />
                    )}
                  </GridItem>
                ))}
              </Grid>
            </>
          )}

          {errors.form && (
            <FormErrorMessage color="red.500">{errors.form}</FormErrorMessage>
          )}

          {!usePin && (
            <Button colorScheme="teal" type="submit" width="full">
              Login
            </Button>
          )}

          <Button variant="link" onClick={() => setUsePin(!usePin)} mt="4">
            {usePin ? "Use Username and Password" : "Use PIN to Login"}
          </Button>

          <Box mt="4" textAlign="center">
            <Link to="/register" style={{ color: "teal", marginRight: "10px" }}>
              Don't have an account? Register here
            </Link>
            <br />
            <Link
              to="/forgot-password"
              style={{ color: "teal", marginRight: "10px" }}
            >
              Forgot Password?
            </Link>
            <br />
            <Link to="/forgot-username" style={{ color: "teal" }}>
              Forgot Username?
            </Link>
          </Box>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
