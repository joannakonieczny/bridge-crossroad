// import Image from "next/image";
// import styles from "./page.module.css";

import LandingPage1 from "@/components/pages/landing-page/LandingPage1";
import LandingPage2 from "@/components/pages/landing-page/LandingPage2";
import LandingPage3 from "@/components/pages/landing-page/LandingPage3";
import MinimalisticNavbar from "@/components/pages/landing-page/MinimalisticNavbar";
import { Flex } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex direction="column" minHeight="100vh">
      <MinimalisticNavbar />
      <LandingPage1 />
      <LandingPage2 />
      <LandingPage3 />
    </Flex>
  );
}
