import React, { useEffect } from "react";
import { Table, Thead, Tbody, Tr, Th, Box, Skeleton, SkeletonText, Td } from "@chakra-ui/react";
import Annoucment from "./Annoucment";
import { usePartnershipPostsQuery } from "@/lib/queries";
import dayjs from "dayjs";
import { PartnershipPostSchemaTypePopulated } from "@/schemas/model/partnership-post/partnership-post-types";

export default function AnnoucmentsList() {
  const postsQuery = usePartnershipPostsQuery();

  useEffect(() => {
    console.log("partnership posts:", postsQuery.data);
  }, [postsQuery.data]);

  // loading: show skeleton rows
  if (postsQuery.isLoading) {
    return (
      <Box bg="bg" p={4} borderRadius="md">
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Nazwa</Th>
              <Th>Zawodnik</Th>
              <Th display={{ base: "none", md: "table-cell" }}>Częstotliwość</Th>
              <Th display={{ base: "none", md: "table-cell" }}>Preferowany system</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.from({ length: 3 }).map((_, i) => (
              <Tr key={`skeleton-${i}`}>
                <Td py={2}>
                  <Box>
                    <Skeleton height="16px" mb={2} />
                    <SkeletonText noOfLines={1} spacing="2" />
                  </Box>
                </Td>
                <Td py={2}>
                  <Skeleton height="16px" />
                </Td>
                <Td py={2} display={{ base: "none", md: "table-cell" }}>
                  <Skeleton height="16px" />
                </Td>
                <Td py={2} display={{ base: "none", md: "table-cell" }}>
                  <Skeleton height="16px" />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    );
  }

  // not loading: zakładamy, że postsQuery.data istnieje
  const raw = postsQuery.data as any;
  const posts: PartnershipPostSchemaTypePopulated[] = Array.isArray(raw) ? raw : raw.data;

  const parseDate = (s: string) => {
    const cleaned = String(s).replace(/^\$D/, "");
    const d = dayjs(cleaned);
    return d.isValid() ? d.format("DD.MM.YYYY, HH:mm") : "";
  };

  return (
    <Box bg="bg" p={4} borderRadius="md">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Nazwa</Th>
            <Th>Zawodnik</Th>
            <Th display={{ base: "none", md: "table-cell" }}>Częstotliwość</Th>
            <Th display={{ base: "none", md: "table-cell" }}>Preferowany system</Th>
          </Tr>
        </Thead>
        <Tbody>
          {posts.map((p: PartnershipPostSchemaTypePopulated) => {
            const id = p.id;
            const title = p.name;
            const frequency = p.data.type; // "SINGLE" lub "PERIOD"
            const preferredSystem = p.biddingSystem; // w przykładzie
            const date =
              p.data.type === "PERIOD"
                ? parseDate(p.data.endsAt as unknown as string)
                : parseDate(p.data.event.duration.startsAt as unknown as string);
            const owner = p.owner;
            const playerName = `${owner.name.firstName} ${owner.name.lastName}`;
            const playerNick = owner.nickname;
            const description = p.description;

            const ann: any = {
              id,
              title,
              date,
              playerName,
              playerNick,
              frequency,
              preferredSystem,
              description
            };

            return <Annoucment key={id} a={ann} />;
          })}
        </Tbody>
      </Table>
    </Box>
  );
}
