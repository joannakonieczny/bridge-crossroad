import { Box, Flex, VStack, Text, HStack, Button, Spacer } from "@chakra-ui/react";

const tools = [
    {
        title: "Generator rozdań",
        description: "Prosty generator losowych rozdań",
        link: ""
    }
];

export default function UsefulTools() {
    return (
    <Flex bg="gray.50" 
          align="center" 
          justify="center"
          py={"2rem"}>
        <VStack>
            <Box h="4rem"
             w="100rem"
             px={"2rem"}
             boxShadow="sm"
             bg="white"
             alignContent="center">
                <Text fontWeight="bold" >
                    Przydatne narzędzia
                </Text>
            </Box>
            <Box>
            {tools.map((tool, i) => (
                <Box h="13rem" w="100rem" bg="white" key={i}>
                    <HStack spacing={0} h="13rem" w="100rem">
                        <Box h="13rem" w="1rem" bg="purple.100" alignSelf="start"/>
                        <Box h="13rem" w="13rem" bg="gray.400" alignSelf="start"/>
                        <Box px={"2rem"}>
                            <VStack align="start">
                                <Text fontWeight="bold"> {tool.title} </Text>
                                <Text> {tool.description} </Text>
                            </VStack>
                        </Box>
                        <Spacer/>
                        <Box alignSelf="end" px={"1rem"} py={"1rem"}>
                            <Button bgColor="white" borderColor="purple.500" borderWidth="0.125rem">
                                <Text fontSize="sm" color="purple.500">
                                    Zobacz więcej
                                </Text>
                            </Button>
                        </Box>
                    </HStack>
                </Box>
            ))}
            </Box>
        </VStack>
    </Flex>
    );
}