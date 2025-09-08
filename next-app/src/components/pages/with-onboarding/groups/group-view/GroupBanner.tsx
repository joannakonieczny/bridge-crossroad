import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import { Box, Flex } from "@chakra-ui/react";

interface IGroupBannerProps {

}

export default function GroupBanner(props: IGroupBannerProps) {
    return (
        <Flex
            backgroundColor="white"
            width="100%"
            paddingY="0.75rem"
            paddingX="2rem"
        >
            <Flex> {/* górna sekcja */}
                <Flex
                    width="10rem"
                    height="10rem"
                    marginRight="1.5rem"
                > {/* zdjęcie */}
                    <Box backgroundColor="accent.100" width="1rem" height="100%"></Box>
                    <Box backgroundColor="border.300" width="100%" height="100%"></Box>
                </Flex>
                <Flex direction="column"> {/* dane szczegółowe */}
                    <ResponsiveHeading fontSize="xl" text="pies pies" showBar={false} width="100%" />
                    <Flex width="50%">
                        <Box>
                            <ResponsiveHeading fontSize="md" text="pies pies" showBar={false}/>
                        </Box>
                        <Box>
                            <ResponsiveHeading fontSize="md" text="pies pies" showBar={false}/>
                        </Box>
                        <Box>
                            <ResponsiveHeading fontSize="md" text="pies pies" showBar={false}/>
                        </Box>
                    </Flex>
                </Flex>
            </Flex>
            <Flex justifyContent="space-between"> {/* opis grupy */}
            </Flex>
        </Flex>
    );
}