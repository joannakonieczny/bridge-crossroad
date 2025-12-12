"use client";

import { Image, Skeleton, Box } from "@chakra-ui/react";
import { useState } from "react";
import { ChakraSVG } from "../chakra-config/ChakraSVG";
import LandscapePlaceholder from "@/assets/fallbacks/landscape-placeholder.svg";
import type { ImageProps } from "@chakra-ui/react";

export function GenericImage(imageProps: ImageProps) {
  const [loading, setLoading] = useState(() => !!imageProps.src);

  const FallbackComponent = () => (
    <Box
      {...imageProps}
      bg="border.100"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <ChakraSVG svg={LandscapePlaceholder} w="100%" h="100%" />
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
