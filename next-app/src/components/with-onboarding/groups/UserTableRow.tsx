import { Tr, Td, Text, Box, Link } from '@chakra-ui/react';

interface UserTableRowProps {
  fullName: string;
  nickname?: string;
  pzbsId?: string;
  bboId?: string;
  cuebidsId?: string;
}

export default function UserTableRow({
  fullName,
  nickname,
  pzbsId,
  bboId,
  cuebidsId,
}: UserTableRowProps) {
  return (
    <Tr>
      <Td>
        <Box>
          <Text fontWeight="bold" fontSize="md">
            {fullName}
          </Text>
          {nickname && (
            <Text fontSize="sm" color="gray.500" mt={2} fontStyle={'italic'}>
              {nickname}
            </Text>
          )}
        </Box>
      </Td>

      <Td>
        {pzbsId ? (
          <Link
            href={`https://msc.com.pl/cezar/?p=21&pid_search=${pzbsId}`}
            isExternal
            fontWeight="semibold"
            color="blue.600"
            fontSize="sm"
          >
            {pzbsId}
          </Link>
        ) : (
          <Text color="gray.400">-</Text>
        )}
      </Td>

      <Td>
        <Text fontSize="sm">{bboId || <Text as="span" color="gray.400">-</Text>}</Text>
      </Td>

      <Td>
        <Text fontSize="sm">{cuebidsId || <Text as="span" color="gray.400">-</Text>}</Text>
      </Td>
    </Tr>
  );
}
