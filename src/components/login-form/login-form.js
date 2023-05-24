import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Container, Box, Flex, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import { useUserContext } from "../../contexts/user-context/user-context";

const LoginForm = () => {

    const { user, login } = useUserContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const handleSignIn = (e) => {
        e.preventDefault();
        login(email, password);
    };

    if (user)
        return <Navigate to='/receiving' replace />;

    return (
        <Container>
            <form onSubmit={handleSignIn}>

                <Box margin={2}>
                    <Input
                        placeholder='Username'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Box>

                <Box margin={2}>
                    <InputGroup size='md'>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </Box>

                <Flex justify="flex-end" margin={2}>
                    <Button type="submit" colorScheme="blue">Submit</Button>
                </Flex>

            </form>
        </Container>
    )
}

export default LoginForm