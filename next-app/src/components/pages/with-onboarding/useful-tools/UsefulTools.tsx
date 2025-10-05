"use client";

import { Box, Flex, VStack, Text, HStack, Button, Spacer, AbsoluteCenter, Link } from "@chakra-ui/react";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import { FaGreaterThan } from "react-icons/fa";
import { useTranslations } from "@/lib/typed-translations";
import tools from './tools';
import type { IAppMessagesForLanguage } from '../../../../../messages/pl';

type ToolKey = keyof IAppMessagesForLanguage['pages']['UsefulTools']['tools'];

export default function UsefulTools() {
    const t = useTranslations("pages.UsefulTools")

    return (
    <Flex bg="border.50" 
          justify="center"
          w="full"
          h="full">
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
                {Object.entries(tools).map(([Tool, {icon: ToolIcon, link: ToolLink}], i) => (
                    <Box h="13rem" w="100rem" bg="white" key={i} >
                        <HStack spacing={0} h="full" w="full">
                            <Box h="full" w="1rem" bg={ i%2 == 0 ? "accent.100" : "secondary.100"} alignSelf="start"/>
                            <Box h="full" w="13rem" bg={ i%2 == 0 ? "border.500" : "secondary.500"} alignSelf="start" position="relative">
                                <AbsoluteCenter>
                                    <ToolIcon color="white" fontSize="8rem"/>
                                </AbsoluteCenter>
                            </Box>
                            <Box px={"2rem"} flex="1">
                                <VStack align="start">
                                    <ResponsiveHeading
                                        fontSize="xl"
                                        text={t(`tools.${Tool as ToolKey}.title`)} 
                                        showBar={false}
                                    />
                                    <Box h="2px" w="50rem" bg="accent.200" />
                                    <Text> {t(`tools.${Tool as ToolKey}.description`)} </Text>
                                </VStack>
                            </Box>
                            <Spacer/>
                            <Box alignSelf="end" px={"1rem"} py={"1rem"}>
                                <Link 
                                    href={ToolLink} isExternal> 
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