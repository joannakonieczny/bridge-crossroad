import { Box, Spinner } from "@chakra-ui/react";

export function LoadingSpinner() {
  return (
    <Spinner
      emptyColor="accent.200"
      color="accent.500"
      size="xl"
      thickness="5px"
    />
  );
}

export function FullPageLoadingSpinner() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <LoadingSpinner />
    </Box>
  );
}
