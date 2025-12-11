"use client";

import { Image, Skeleton, Box } from "@chakra-ui/react";
import { useState } from "react";
import type { ElementType, SVGProps } from "react";
import { ChakraSVG } from "../chakra-config/ChakraSVG";
import type { ImageProps } from "@chakra-ui/react";

export type GenericImageProps = {
  fallback: ElementType<SVGProps<SVGSVGElement>>;
  imageProps: ImageProps;
};

export function GenericImage({ fallback, imageProps }: GenericImageProps) {
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
      <ChakraSVG svg={fallback} w="100%" h="100%" />
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
          {...imageProps}
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
