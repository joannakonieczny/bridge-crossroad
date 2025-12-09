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
      w={imageProps.w}
      h={imageProps.h}
      maxW={imageProps.maxW}
      maxH={imageProps.maxH}
      borderTopRadius={imageProps.borderTopRadius}
      borderRadius={imageProps.borderRadius}
      boxShadow={imageProps.boxShadow}
      objectFit={imageProps.objectFit}
      cursor={imageProps.cursor}
      onClick={imageProps.onClick}
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <ChakraSVG svg={fallback} w="100%" h="100%" />
    </Box>
  );

  return (
    <Skeleton isLoaded={!loading} w={imageProps.w} h={imageProps.h}>
      {imageProps.src ? (
        <Image
          {...imageProps}
          alt={imageProps.alt}
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
