"use-cliet";

import { Box, Flex, VStack, Text, HStack, Button, Spacer, AbsoluteCenter, Link } from "@chakra-ui/react";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import { TbSquareLetterBFilled, TbFlagQuestion } from "react-icons/tb";
import { FaGreaterThan } from "react-icons/fa";
import { GrDatabase } from "react-icons/gr";
import { GiSuits } from "react-icons/gi";
import { useTranslations } from "@/lib/typed-translations";

const toolNames = {
    "bridgeBase": TbSquareLetterBFilled,
    "rpBridge": TbFlagQuestion,
    "simonsConventions": GrDatabase,
    "cuebids": GiSuits
}

export default function UsefulTools() {
    const t = useTranslations("pages.UsefulTools")

    return (
    <Flex bg="border.50" 
          align="center" 
          justify="center">
        <VStack spacing="2rem">
            <Box h="4rem"
             w="100rem"
             px="2rem"
             mt="2rem"
             boxShadow="sm"
             bg="white"
             alignContent="center">
                <ResponsiveHeading
                    fontSize="3xl"
                    text={t("title")}
                />
            </Box>
            <VStack spacing="2rem">
                {Object.entries(toolNames).map(([Tool, Icon], i) => (
                    <Box h="13rem" w="100rem" bg="white" key={i} >
                        <HStack spacing={0} h="full" w="full">
                            <Box h="full" w="1rem" bg={ i%2 == 0 ? "accent.100" : "secondary.100"} alignSelf="start"/>
                            <Box h="full" w="13rem" bg={ i%2 == 0 ? "border.500" : "secondary.500"} alignSelf="start" position="relative">
                                <AbsoluteCenter>
                                    <Icon color="white" fontSize="8rem"/>
                                </AbsoluteCenter>
                            </Box>
                            <Box px={"2rem"} flex="1">
                                <VStack align="start">
                                    <ResponsiveHeading
                                        fontSize="xl"
                                        text={t(`tools.${Tool}.title`)} 
                                        showBar={false}
                                    />
                                    <Box h="2px" w="50rem" bg="accent.200" />
                                    <Text> {t(`tools.${Tool}.description`)} </Text>
                                </VStack>
                            </Box>
                            <Spacer/>
                            <Box alignSelf="end" px={"1rem"} py={"1rem"}>
                                <Link href={t(`tools.${Tool}.link`)} isExternal> 
                                    <Button 
                                        color="accent.500" 
                                        fontSize="sm" 
                                        bgColor="white" 
                                        borderColor="accent.500" 
                                        borderWidth="0.125rem" 
                                        rightIcon={<FaGreaterThan />}
                                        >
                                        {t("buttonText")} 
                                    </Button>
                                </Link>
                            </Box>
                        </HStack>
                    </Box>
                ))}
            </VStack>
        </VStack>
    </Flex>
    );
}