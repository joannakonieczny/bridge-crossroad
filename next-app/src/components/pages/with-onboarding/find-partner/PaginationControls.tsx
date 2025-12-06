import React from "react";
import Pagination from "@/components/common/Pagination";
import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";
import { usePartnershipPostsQuery } from "@/lib/queries";
import { PartnershipPostsLimitPerPage } from "./util";

export default function PaginationControls() {
  const [{ page, groupId }, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    groupId: parseAsString,
  });

  const validPage = Math.max(1, page);

  const postsQuery = usePartnershipPostsQuery({
    page: validPage,
    groupId: groupId || undefined,
    limit: PartnershipPostsLimitPerPage,
  });

  return (
    <Pagination
      current={validPage}
      totalPages={postsQuery.data?.pagination?.totalPages || 1}
      onChange={(p) => setQuery({ page: Math.max(1, p) })}
      size="sm"
    />
  );
}
