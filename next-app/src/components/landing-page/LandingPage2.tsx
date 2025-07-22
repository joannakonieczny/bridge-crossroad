import { Box } from "@chakra-ui/react";
import Image from "next/image";

export default function LandingPage2() {
  return (
    <Box style={{ width: '100%', height: '100vh', position: 'relative', overflowX: 'hidden', backgroundColor: '#D5D5FF' }}>
      <Box style={{ width: '100%', height: '90vh', position: 'absolute', top: "50%", left: 0, transform: "translateY(-50%)" }}>
        <Image
          src="/assets/landing-page/landing-page-2.svg"
          alt="Logo"
          fill
          style={{ position: 'absolute', objectFit: 'contain', objectPosition: 'left top' }}
        />
      </Box>
    </Box>
  );
}