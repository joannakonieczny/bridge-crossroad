import { Box, Flex, HStack, Button, Input, VStack } from "@chakra-ui/react";
import Sidebar from "./Sidebar";

const sampleData = [
    {
      fullName: 'Jan Kowalski',
      nickname: 'jan123',
      pzbsId: '123456',
      bboId: 'jk_bbo',
      cuebidsId: 'ABCABC',
    },
    {
      fullName: 'Michał Wiśniewski',
      nickname: 'MWisnia',
      pzbsId: '654321',
      bboId: 'michal_wisnia',
      cuebidsId: 'XYZXYZ',
    },
    {
      fullName: 'Piotr Nowak',
      nickname: 'pionowak',
      pzbsId: '',
      bboId: '',
      cuebidsId: '',
    },
];

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