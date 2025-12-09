import { Image, Skeleton, Box } from "@chakra-ui/react";
import { useState } from "react";
import { ElementType, SVGProps } from "react";
import { ChakraSVG } from "../chakra-config/ChakraSVG";
import { ImageProps } from "@chakra-ui/react";

export type GenericImageProps = {
  fallback: ElementType<SVGProps<SVGSVGElement>>;
  imageProps: ImageProps;
};

export function GenericImage({ fallback, imageProps }: GenericImageProps) {
  const [loading, setLoading] = useState(() => !!imageProps.src);

  return (
    <Skeleton isLoaded={!loading} w={imageProps.w} h={imageProps.h}>
      {imageProps.src ? (
        <Image
          {...imageProps}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      ) : (
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
      )}
    </Skeleton>
  );
}
