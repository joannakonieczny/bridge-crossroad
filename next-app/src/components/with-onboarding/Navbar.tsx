'use client';

import * as React from 'react';
import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabIndicator,
  Heading,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import ProfilePicture from '@/components/util/ProfilePicture';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export interface IAppProps {}

export default function App(props: IAppProps) {
  const pathname = usePathname();

  const tabs = [
    '/dashboard',
    '/calendar',
    '/groups',
    '/find-partner',
    '/tools',
  ];

  const defaultIndex = React.useMemo(() => {
    const match = tabs.findIndex((path) =>
      pathname.startsWith(path)
    );
    return match === -1 ? 0 : match;
  }, [pathname]);

  return (
    <Flex
      as="nav"
      bg="white"
      p={4}
      boxShadow="sm"
      alignItems="center"
      position="sticky"
      top={0}
      zIndex={1000}
      pl={8}
    >
      <Flex gap={2} mr={100}>
        <Heading as="h1" size="md">
          Bridge Crossroad
        </Heading>
        <Box
          style={{
            width: '1.875rem',
            height: '1.75rem',
            position: 'relative',
            marginRight: '1rem',
          }}
        >
          <Image
            src="/common/logo-lightmode.svg"
            alt="Logo"
            priority
            fill
            style={{ objectFit: 'contain', objectPosition: 'left top' }}
          />
        </Box>
      </Flex>

      <Tabs
        position="relative"
        variant="unstyled"
        alignItems="center"
        defaultIndex={defaultIndex}
      >
        <TabList gap={8} color="accent.500">
          <Tab as={Link} href="/dashboard" _selected={{ color: 'black' }} _focus={{ boxShadow: 'none' }}>
            Strona główna
          </Tab>
          <Tab as={Link} href="/calendar" _selected={{ color: 'black' }} _focus={{ boxShadow: 'none' }}>
            Kalendarz
          </Tab>
          <Tab as={Link} href="/groups" _selected={{ color: 'black' }} _focus={{ boxShadow: 'none' }}>
            Grupy
          </Tab>
          <Tab as={Link} href="/find-partner" _selected={{ color: 'black' }} _focus={{ boxShadow: 'none' }}>
            Szukaj Partnera
          </Tab>
          <Tab as={Link} href="/tools" _selected={{ color: 'black' }} _focus={{ boxShadow: 'none' }}>
            Przydatne narzędzia
          </Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="black" borderRadius="1px" />
      </Tabs>

      <Flex flex={1} justifyContent="flex-end" alignItems="center" gap={4}>
        <ProfilePicture size={3.75} />
        <Menu>
           {({ isOpen }) => (
            <>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={isOpen ? <FaAngleDown size="1.5rem" /> : <FaAngleRight size="1.5rem" />}
                variant="unstyled"
                _hover={{ bg: 'transparent' }}
                _active={{ bg: 'transparent' }}
                _focus={{ boxShadow: 'none' }}
              />
              <MenuList
                minWidth="240px"
                bg="white"
                borderColor="gray.200"
                boxShadow="md"
                borderRadius="md"
                mt={4}
              >
                <MenuItem icon={<FaAngleDown />}>New Tab</MenuItem>
                <MenuItem icon={<FaAngleDown />}>New Window</MenuItem>
                <MenuItem icon={<FaAngleDown />}>Open Closed Tab</MenuItem>
                <MenuItem icon={<FaAngleDown />}>Open File...</MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
      </Flex>
    </Flex>
  );
}
