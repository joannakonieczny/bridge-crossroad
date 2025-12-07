"use client";

import React from "react";
import { Box, HStack, Button, Text } from "@chakra-ui/react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

type PaginationProps = {
  current: number;
  totalPages: number | undefined;
  onChange: (page: number) => void;
  renderPage?: (page: number, isCurrent: boolean) => React.ReactNode;
  prevLabel?: string;
  nextLabel?: string;
  size?: "xs" | "sm" | "md" | "lg";
};

export default function Pagination({
  current,
  totalPages,
  onChange,
  renderPage,
  prevLabel = "",
  nextLabel = "",
  size = "sm",
}: PaginationProps) {
  if (!totalPages || totalPages <= 1) return null;

  const handlePrev = () => {
    if (current > 1) onChange(current - 1);
  };
  const handleNext = () => {
    if (current < (totalPages ?? 1)) onChange(current + 1);
  };
  const handleFirst = () => {
    if (current > 1) onChange(1);
  };
  const handleLast = () => {
    if (current < (totalPages ?? 1)) onChange(totalPages ?? 1);
  };

  const pagesSet = new Set<number>([
    1,
    current - 1,
    current,
    current + 1,
    totalPages,
  ]);
  const pages = Array.from(pagesSet)
    .filter((p) => p >= 1 && p <= (totalPages ?? 1))
    .sort((a, b) => a - b);

  return (
    <Box mt={4}>
      <HStack justify="center" spacing={3}>
        <Button
          size={size}
          variant="ghost"
          onClick={handleFirst}
          isDisabled={current <= 1}
          aria-label="first"
        >
          <FaAngleDoubleLeft />
        </Button>

        <Button
          size={size}
          variant="ghost"
          onClick={handlePrev}
          isDisabled={current <= 1}
          aria-label={prevLabel}
        >
          <FaAngleLeft />
        </Button>

        <HStack spacing={1} align="center">
          {pages.map((page, idx) => {
            const isCurrent = page === current;
            const prevPage = pages[idx - 1];
            const needEllipsis = idx > 0 && page > (prevPage ?? 0) + 1;

            return (
              <React.Fragment key={`page-frag-${page}`}>
                {needEllipsis && (
                  <Text key={`ellipsis-${page}`} px={2} color="border.500">
                    …
                  </Text>
                )}

                <Button
                  key={page}
                  size={size}
                  variant={isCurrent ? "solid" : "outline"}
                  onClick={() => onChange(page)}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {renderPage ? renderPage(page, isCurrent) : page}
                </Button>
              </React.Fragment>
            );
          })}
        </HStack>

        <Button
          size={size}
          variant="ghost"
          onClick={handleNext}
          isDisabled={current >= totalPages}
          aria-label={nextLabel}
        >
          <FaAngleRight />
        </Button>

        <Button
          size={size}
          variant="ghost"
          onClick={handleLast}
          isDisabled={totalPages === undefined || current >= totalPages}
          aria-label="last"
        >
          <FaAngleDoubleRight />
        </Button>
      </HStack>
    </Box>
  );
}
