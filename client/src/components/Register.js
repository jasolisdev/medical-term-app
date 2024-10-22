import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    pin: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    // PIN length validation
    if (formData.pin.length !== 4) {
      setErrors({ pin: "PIN must be exactly 4 digits" });
      return;
    }

    try {
      await axios.post("/api/register", formData);
      navigate("/login"); // Redirect to login after successful registration
    } catch (error) {
      const errorMsg =
        error.response?.data?.errors?.[0]?.msg || "Registration failed";
      setErrors({ form: errorMsg });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="8" p="8" borderWidth="1px" borderRadius="lg">
      <Heading mb="6">Register</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing="4">
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

          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              isRequired
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                isRequired
              />
              <InputRightElement>
                <IconButton
                  variant="ghost"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.pin}>
            <FormLabel>PIN (4 Digits)</FormLabel>
            <InputGroup>
              <Input
                type={showPin ? "text" : "password"}
                name="pin"
                placeholder="Enter a 4-digit PIN"
                value={formData.pin}
                onChange={handleChange}
                maxLength={4}
                isRequired
              />
              <InputRightElement>
                <IconButton
                  variant="ghost"
                  aria-label={showPin ? "Hide PIN" : "Show PIN"}
                  icon={showPin ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowPin(!showPin)}
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.pin}</FormErrorMessage>
          </FormControl>

          {errors.form && <FormErrorMessage>{errors.form}</FormErrorMessage>}

          <Button colorScheme="teal" type="submit" width="full">
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Register;
