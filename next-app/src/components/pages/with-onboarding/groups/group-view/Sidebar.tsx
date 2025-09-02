import {
  Box,
  Flex,
  VStack,
  Text,
  Avatar,
  Divider,
  Link,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiUser,
  FiMessageCircle,
  FiFolder,
  FiGrid,
} from "react-icons/fi";

const group = { id: 1, name: "test group", img: "/assets/dashboard/splash-art.svg" };

const members = [
    {
      fullName: 'Jan Kowalski',
      nickname: 'jan123',
      pzbsId: '123456',
      bboId: 'jk_bbo',
      cuebidsId: 'ABCABC',
    },
    {
      fullName: 'Michał Wiśniewski',
      nickname: 'MWisnia',
      pzbsId: '654321',
      bboId: 'michal_wisnia',
      cuebidsId: 'XYZXYZ',
    },
    {
      fullName: 'Piotr Nowak',
      nickname: 'pionowak',
      pzbsId: '',
      bboId: '',
      cuebidsId: '',
    },
];


export default function Sidebar() {
  return (
    <Box w="17rem" p={4}>
      <VStack align="start" spacing={4}>
        <Link fontSize="sm" color="purple.500">
          <Flex align="center" gap={2}>
            <FiArrowLeft size={18} />
            <Text>Wróć</Text>
          </Flex>
        </Link>

        <Avatar
          size="lg"
          name={group.name}
          src={group.img}
          borderRadius="md"
        />
        <Box>
          <Text fontWeight="bold">{group.name}</Text>
          <Text fontSize="sm" color="gray.500">
            {members.length} członków
          </Text>
        </Box>
      </VStack>

      <Divider my={4} />

      <VStack align="stretch" spacing={1}>
        {[
            { icon: FiUser, label: "O grupie" },
            { icon: FiMessageCircle, label: "Czat" },
            { icon: FiFolder, label: "Materiały" },
            { icon: FiGrid, label: "Rozdania" },
        ].map((item, idx) => (
            <Link key={idx} _hover={{ textDecoration: "none" }}>
            <Flex
                align="center"
                gap={3}
                p={2}
                borderRadius="md"
                _hover={{ bg: "gray.100", color: "purple.500" }}
            >
                <item.icon size={18} />
                <Text>{item.label}</Text>
            </Flex>
            </Link>
        ))}
        </VStack>
    </Box>
  );
}