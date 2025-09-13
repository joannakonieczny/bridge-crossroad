import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import ResponsiveText from "@/components/common/texts/ResponsiveText";
import { Box, Flex, HStack, VStack } from "@chakra-ui/react";

interface IGroupBannerProps {}

export default function GroupBanner(props: IGroupBannerProps) {
    return (
        <Flex
            backgroundColor="white"
            width="100%"
            paddingY="0.75rem"
            paddingX="2rem"
            direction="column"
            gap="2rem"
        >
            <Flex width="100%"> {/* górna sekcja */}
                <Flex
                    width="10rem"
                    height="10rem"
                    marginRight="1.5rem"
                > {/* zdjęcie */}
                    <Box backgroundColor="accent.100" width="1rem" height="100%"></Box>
                    <Box backgroundColor="border.300" width="100%" height="100%"></Box>
                </Flex>
                <Flex direction="column" flex="1"> {/* dane szczegółowe */}
                    <ResponsiveHeading fontSize="xl" text="pies pies" showBar={false} width="100%" />
                    
                    <HStack width="100%" spacing="2rem" justify="space-between">
                        <Flex direction="column">
                            <ResponsiveHeading fontSize="md" text="Administrator" showBar={false}/>
                            <ResponsiveText>Szymon Kubiczek</ResponsiveText>
                            <ResponsiveText color="gray.500" fontStyle="italic">Cuebiczek</ResponsiveText>
                        </Flex>
                        <Flex direction="column">
                            <ResponsiveHeading fontSize="md" text="Data założenia" showBar={false}/>
                            <ResponsiveText>09.09.2025</ResponsiveText>
                        </Flex> 
                        <Flex direction="column">
                            <ResponsiveHeading fontSize="md" text="Liczba członków" showBar={false}/>
                            <ResponsiveText>12</ResponsiveText>
                        </Flex>
                            
                        
                    </HStack>
                </Flex>
            </Flex>
            <Flex direction="column"> {/* opis grupy */}
                <ResponsiveHeading barOrientation="horizontal" fontSize="md" text="Opis grupy" showBar={true}/>
                <ResponsiveText>pies pies pies pies pies pies pies pies pies pies pies pies pies pies pies pies pies pies pies pies pies pies pies pies </ResponsiveText>
            </Flex>
        </Flex>
    );
}
