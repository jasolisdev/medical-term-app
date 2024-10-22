// client/src/components/ForgotPassword.js
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  FormErrorMessage,
} from "@chakra-ui/react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      // Assuming there's an endpoint for forgot password
      await axios.post("/api/forgot-password", { email });
      setMessage(
        "If an account with this email exists, you will receive an email to reset your password.",
      );
    } catch (error) {
      const errorMsg =
        error.response?.data?.errors?.[0]?.msg || "Error occurred";
      setErrors({ form: errorMsg });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="8" p="8" borderWidth="1px" borderRadius="lg">
      <Heading mb="6">Forgot Password</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing="4">
          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
              isRequired
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          {errors.form && <FormErrorMessage>{errors.form}</FormErrorMessage>}
          {message && <Box color="green.500">{message}</Box>}

          <Button colorScheme="teal" type="submit" width="full">
            Submit
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ForgotPassword;
