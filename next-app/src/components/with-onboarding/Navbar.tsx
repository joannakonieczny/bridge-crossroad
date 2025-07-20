'use client';

import { useMemo,  } from 'react';
import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabIndicator,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import Link from 'next/link';
import ProfilePicture from '@/components/common/ProfilePicture';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { navbarTabs } from '../../../routes';
import Logo from '../common/Logo';

export default function App() {
  const pathname = usePathname();
  
  const defaultIndex = useMemo(() => {
    const match = navbarTabs.findIndex((path) =>
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
      <Logo />
      <Tabs
        position="relative"
        variant="unstyled"
        alignItems="center"
        defaultIndex={defaultIndex}
      >
        <TabList gap={8} color="accent.500">
          <Tab as={Link} href={ navbarTabs[0] } _selected={{ color: 'black' }} _focus={{ boxShadow: 'none' }}>
            Strona główna
          </Tab>
          <Tab as={Link} href={ navbarTabs[1] } _selected={{ color: 'black' }} _focus={{ boxShadow: 'none' }}>
            Kalendarz
          </Tab>
          <Tab as={Link} href={ navbarTabs[2] } _selected={{ color: 'black' }} _focus={{ boxShadow: 'none' }}>
            Grupy
          </Tab>
          <Tab as={Link} href={ navbarTabs[3] } _selected={{ color: 'black' }} _focus={{ boxShadow: 'none' }}>
            Szukaj Partnera
          </Tab>
          <Tab as={Link} href={ navbarTabs[4] } _selected={{ color: 'black' }} _focus={{ boxShadow: 'none' }}>
            Przydatne narzędzia
          </Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="black" borderRadius="1px" />
      </Tabs>

      <Flex flex={1} justifyContent="flex-end" alignItems="center" gap={4}>
        <ProfilePicture size="3.75rem" />
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
                borderColor="border.200"
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
