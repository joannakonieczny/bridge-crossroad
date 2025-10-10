"use client";

import { Box, Flex, VStack, Text, Button, Link, Icon } from "@chakra-ui/react";
import ResponsiveHeading from "@/components/common/texts/ResponsiveHeading";
import { FaGreaterThan } from "react-icons/fa";
import { useTranslations } from "@/lib/typed-translations";
import tools from '../../../../club-preset/useful-tools';
import type { IAppMessagesForLanguage } from '../../../../../messages/pl';

type ToolKey = keyof IAppMessagesForLanguage['pages']['UsefulTools']['tools'];

export default function UsefulTools() {
    const t = useTranslations("pages.UsefulTools")

    return (
    <Box bg="border.50">
        <Flex 
            justify="center"
            w="full"
            minH="calc(100dvh - 5rem)"
            px={{ base: 4, md: 8 }}
        >
            <VStack spacing={{ base: "1.25rem", md: "2rem" }}>
                <Box
                    bg="bg"
                    w="full"                                 
                    maxW={{ base: "full", md: "70rem" }}
                    mx="auto"                         
                    mt={{ base: "2rem", md: "3rem" }}
                    display="flex"
                    alignItems="center"
                >
                    <ResponsiveHeading
                        fontSize="3xl"
                        text={t("title")}
                    />
                </Box>
                <VStack spacing={{ base: "1rem", md: "2rem" }} mb={{ base: "1rem", md: "2rem" }} w="full" align="center">
                    {Object.entries(tools).map(([Tool, {icon: ToolIcon, link: ToolLink}], i) => (
                        <Box 
                            minH={{ base: "auto", md: "13rem" }} 
                            w="full"
                            maxW={{ base: "full", md: "70rem" }}
                            mx="auto"                             
                            bg="bg" 
                            key={Tool}
                        >
                            <Flex 
                                direction={{ base: "column", md: "row" }} 
                                h="100%" 
                                w="100%"
                                align="stretch" 
                            > 
                                <Flex 
                                    direction="row" 
                                    h={{ base: "8rem", md: "13rem" }}
                                    w={{ base: "100%", md: "15rem" }} 
                                    flexShrink={0}
                                >
                                    <Box 
                                        h="100%"
                                        w={{ base: "0.75rem", md: "1rem" }} 
                                        bg={i % 2 === 0 ? "accent.100" : "secondary.100"} 
                                    />
                                    <Box 
                                        h="100%"
                                        flex={1} 
                                        bg={i % 2 === 0 ? "border.500" : "secondary.500"} 
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        minW={0}
                                    >
                                        <Icon as={ToolIcon} color="bg" boxSize={{ base: "4.5rem", md: "8rem" }} />
                                    </Box>
                                </Flex>
                                <Flex direction={{ base: "column", md: "row" }} flex={1} p={4} gap={3} minW={0}> 
                                    <VStack align="start" spacing={3} w="100%">
                                        <ResponsiveHeading
                                            fontSize="xl"
                                            text={t(`tools.${Tool as ToolKey}.title`)}
                                            showBar={false}
                                        />
                                        <Box h="2px" w="100%" maxW="50rem" bg="accent.200" />
                                        <Text fontSize={{ base: "xs", md: "sm" }} wordBreak="break-word">
                                            {t(`tools.${Tool as ToolKey}.description`)}
                                        </Text>
                                    </VStack>
                                </Flex>
                                <Flex p={4} alignItems="flex-end" justifyContent="flex-end" flexShrink={0}>
                                    <Link href={ToolLink} isExternal>
                                        <Button
                                            color="accent.500"
                                            fontSize={{ base: "xs", md: "sm" }}
                                            bgColor="bg"
                                            borderColor="accent.500"
                                            borderWidth="0.125rem"
                                            rightIcon={<FaGreaterThan />}
                                        >
                                            {t("buttonText")}
                                        </Button>
                                    </Link>
                                </Flex>
                            </Flex>
                        </Box>
                    ))}
                </VStack>
            </VStack>
        </Flex>
    </Box>
    );
}