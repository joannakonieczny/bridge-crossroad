"use client";
import React from "react";
import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "@/components/pages/with-onboarding/calendar/Sidebar";

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
	return (
		<Flex align="stretch" minH="calc(100vh - 5rem)">
			<Sidebar />
			<Box flex="1" p={4}>
				{children}
			</Box>
		</Flex>
	);
}
