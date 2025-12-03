import React from "react";
import Pagination from "@/components/common/Pagination";
import { useQueryState } from "nuqs";
import { usePartnershipPostsQuery } from "@/lib/queries";
import { PartnershipPostsLimitPerPage } from "@/club-preset/partnership-post";

export default function PaginationControls() {
  const [page, setPage] = useQueryState("page", {
    defaultValue: 1,
    parse: (v: unknown) => {
      const n = Number(v);
      return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
    },
    serialize: (v: number) => String(v ?? 1),
  });

  const [groupIdParamRaw] = useQueryState("groupId");
  const groupIdParam = groupIdParamRaw ? String(groupIdParamRaw) : undefined;

  const postsQuery = usePartnershipPostsQuery({ page, groupId: groupIdParam, limit: PartnershipPostsLimitPerPage });

  const handleChange = (p: number) => {
    setPage(p);
  };
  return (
    <Pagination
      current={page}
      totalPages={postsQuery.data?.pagination?.totalPages}
      onChange={handleChange}
      size="sm"
    />
  );
}
