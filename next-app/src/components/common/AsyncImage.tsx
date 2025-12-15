"use client";

import { Image, Skeleton, Box, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { ChakraSVG } from "../chakra-config/ChakraSVG";
import LandscapePlaceholder from "@/assets/fallbacks/landscape-placeholder.svg";
import LandscapePlaceholderDark from "@/assets/fallbacks/landscape-placeholder-dark.svg";
import type { ImageProps } from "@chakra-ui/react";

export function AsyncImage(imageProps: ImageProps) {
  const [loading, setLoading] = useState(() => !!imageProps.src);
  const placeholderSvg = useColorModeValue(LandscapePlaceholder, LandscapePlaceholderDark);

  const FallbackComponent = () => (
    <Box
      {...imageProps}
      bg="neutral.100"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <ChakraSVG svg={placeholderSvg} w="100%" h="100%" />
    </Box>
  );

  return (
    <Skeleton
      isLoaded={!loading}
      w={imageProps.w}
      h={imageProps.h}
      maxW={imageProps.maxW}
      maxH={imageProps.maxH}
    >
      {imageProps.src ? (
        <Image
          objectFit="cover"
          {...imageProps}
          alt={imageProps.alt || "Image"}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          fallback={<FallbackComponent />}
        />
      ) : (
        <FallbackComponent />
      )}
    </Skeleton>
  );
}
