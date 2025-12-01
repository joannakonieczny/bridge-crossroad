import React, { useEffect } from "react";
import Pagination from "@/components/common/Pagination";
import { useQueryState } from "nuqs";
import { usePartnershipPostsQuery } from "@/lib/queries";
import { PartnershipPostsLimitPerPage } from "@/club-preset/partnership-post";

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

  // read groupId from URL params (nuqs)
  const [groupIdParamRaw] = useQueryState("groupId");
  const groupIdParam = groupIdParamRaw ? String(groupIdParamRaw) : undefined;

  // query to get pagination info from server
  const postsQuery = usePartnershipPostsQuery({ page, groupId: groupIdParam, limit: PartnershipPostsLimitPerPage });

  const totalPages = postsQuery.data?.pagination?.totalPages ?? 1;

  useEffect(() => {console.log(postsQuery.data);}, [postsQuery.data]);

  const handleChange = (p: number) => {
    setPage(p);
  };

  useEffect(() => {
    console.log(postsQuery.data?.pagination?.totalPages);
  }, [postsQuery.data]);

  return (
    <Pagination
      current={page}
      totalPages={postsQuery.data?.pagination?.totalPages}
      onChange={handleChange}
      size="sm"
    />
  );
}
