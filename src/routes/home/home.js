import React from 'react';
import { Box, Heading, Text, Button, Flex } from '@chakra-ui/react';
import Link from '../../components/link/link';
import { useUserContext } from '../../contexts/user-context/user-context';

const Home = () => {

    const { user, logout } = useUserContext();

    return (
        <Box padding={5}>
            <Heading>Material Management Portal</Heading>
            <Text>Created for Burns & McDonnell for demonstration purposes only.</Text>
            {user
                ? (
                    <Flex align="center" gap={10} mt={25}>
                        <Text>Welcome {user.name}</Text>
                        <Button
                            onClick={logout}>
                            Log Out
                        </Button>
                    </Flex>
                ) : (
                    <Text>Please <Link to="/login">Login</Link>.</Text>
                )
            }
        </Box>
    )
}

export default Home