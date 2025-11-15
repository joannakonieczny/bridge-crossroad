"use client";
import type { PropsWithChildren } from "react";
import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "@/components/pages/with-onboarding/calendar/Sidebar";

export default function CalendarLayout({ children }: PropsWithChildren) {
	return (
		<Flex align="stretch" minH="calc(100vh - 5rem)">
			<Sidebar />
			<Box flex="1">
				{children}
			</Box>
		</Flex>
	);
}
