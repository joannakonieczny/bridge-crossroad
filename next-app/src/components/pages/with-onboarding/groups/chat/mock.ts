"use client";

/*
Message schema for mock data:
{
    id: IdPropSchema,
    timestamp: date,
    from: User,
    content: string,
    reply?: IdPropSchema, // message id
    attachments?: Url[]
}
*/

export const mockMessages = [
  {
    timestamp: new Date(2024, 2, 10, 2, 30),
    from: {
      id: "user1",
      name: { firstName: "Alice", lastName: "Johnson" },
    },
    content: "Hello!",
    isAdmin: false,
  },
  {
    timestamp: new Date(2024, 2, 10, 2, 31),
    from: {
      id: "user2",
      nickname: "Bob",
      name: { firstName: "Bob", lastName: "Smith" },
    },
    content: "Hi there!",
    isAdmin: false,
  },
  {
    timestamp: new Date(2024, 2, 10, 2, 32),
    from: {
      id: "user3",
      nickname: "Charlie",
      name: { firstName: "Charlie", lastName: "Brown" },
    },
    content: "How are you doing?",
    isAdmin: true,
  },
];
