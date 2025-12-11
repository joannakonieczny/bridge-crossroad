import { Box } from "@chakra-ui/react";
import type { SVGProps } from "react";
import type { BoxProps } from "@chakra-ui/react";

export type ChakraSVGProps = BoxProps & {
  svg: React.ElementType<SVGProps<SVGSVGElement>>;
  onRawSVGElement?: SVGProps<SVGSVGElement>;
};

export function ChakraSVG(props: ChakraSVGProps) {
  const { onRawSVGElement, svg: SVG, ...rest } = props;
  return (
    <Box {...rest}>
      <SVG width="100%" height="100%" {...onRawSVGElement} />
    </Box>
  );
}
