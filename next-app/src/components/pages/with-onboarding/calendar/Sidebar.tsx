"use client";
import React from "react";
import { Box, VStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import SidebarCard from "@/components/common/SidebarCard";

export default function Sidebar() {
	// lewy sidebar ma szerokość 16.5rem i minimalną wysokość calc(100vh - 6rem)
	const router = useRouter();

	return (
		<Box
			w="16.5rem"
			minH="calc(100vh - 5rem)"
			bg="bg"
			flex="0 0 16.5rem"
			p={4}
			overflowY="auto"
			position="relative" // potrzebne dla absolutnie pozycjonowanego przycisku
		>
			<VStack spacing={4} align="stretch" mb="6rem">
				{/* ...wstaw dowolną liczbę kart; poniżej przykładowe 4 */}
				<SidebarCard title="Letnia Stasikówka" />
				<SidebarCard title="Zimowy Zjazd" />
			</VStack>

			{/* przycisk 2rem od dołu przenoszący do upcoming-events/ */}
			<Box position="absolute" bottom="2rem" left={4} right={8}>
				<Button
					w="100%"
					size="sm"
					color="white"
					bg="accent.500"
					_hover={{ bg: "accent.600" }}
					onClick={() => router.push("/upcoming-events/")}
				>
					Zobacz więcej
				</Button>
			</Box>
		</Box>
	);
}
