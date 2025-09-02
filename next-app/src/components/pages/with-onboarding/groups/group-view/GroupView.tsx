import { Box, Flex, VStack } from "@chakra-ui/react";
import Sidebar from "./Sidebar";

export default function GroupView() {
    return (
        <Flex
            minHeight="100vh"
            width="100%"
            py={{ base: "2rem", md: "3rem" }}
            px={{ base: "1rem", md: "4rem", lg: "6rem", xl: "10rem" }}
            gap={{ base: "2rem", lg: "4rem" }}
        >
            <Box flex="1" width="100%">
                <Flex
                    direction="row"      
                    justify="space-between" 
                    align="center"
                    width="100%"
                >
                    <VStack>
                        <Sidebar/>
                    </VStack>
                </Flex>
            </Box>
        </Flex>
    );
}