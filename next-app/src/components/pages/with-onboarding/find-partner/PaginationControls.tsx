import React from "react";
import Pagination from "@/components/common/Pagination";
// use nuqs to sync page with URL
import { useQueryState } from "nuqs";

export default function PaginationControls() {
  // sync "page" query param with URL; default to 1
  const [page, setPage] = useQueryState("page", {
    defaultValue: 1,
    parse: (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
    },
    serialize: (v: number) => String(v ?? 1),
  });

  const totalPages = 4;

  const handleChange = (p: number) => {
    // write new page to URL; nuqs keeps history by default
    setPage(p);
  };

  return (
    <Pagination
      current={page}
      totalPages={totalPages}
      onChange={handleChange}
      size="sm"
    />
  );
}
