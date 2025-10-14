export const QUERY_KEYS = {
	groups: ["groups"] as const,
	group: (id: string | number) => ["group", id] as const,
} as const;
