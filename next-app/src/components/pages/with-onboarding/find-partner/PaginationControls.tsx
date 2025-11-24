import React from "react";
import Pagination from "@/components/common/Pagination";

export default function PaginationControls() {
  // mock values
  const current = 1;
  const totalPages = 4;

  const handleChange = (page: number) => {
    // tutaj wywołaj na przykład setState / fetch danych dla strony `page`
    console.log("change page to", page);
  };

  return (
    <Pagination
      current={current}
      totalPages={totalPages}
      onChange={handleChange}
      size="sm"
    />
  );
}
