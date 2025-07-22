import { Box } from "@chakra-ui/react";
import Image from "next/image";

export default function LandingPage1() {
  return (
    <Box style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Image
        src="/assets/landing-page/landing-page-1.svg"
        alt="Logo"
        fill
        style={{ position: 'absolute', objectFit: 'none', objectPosition: 'left -10rem' }}
      />
    </Box>  
  );
}