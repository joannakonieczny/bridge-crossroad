import * as React from 'react';
import { Flex, Tabs, TabList, Tab, TabIndicator, Heading, Box, Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import ProfilePicture from '@/components/util/ProfilePicture';
import { FaAd } from 'react-icons/fa';

export interface IAppProps {}

export default function App(props: IAppProps) {
  return (
    <Flex as="nav" bg="white" p={4} boxShadow="sm" alignItems={'center'} position={'sticky'} top={0} zIndex={1000} pl={8}>
        <Flex gap={2} mr={100}>
          <Heading as="h1" size="md">Bridge Crossroad</Heading>
          <Box style={{ width: '1.875rem', height: '1.75rem', position: 'relative', marginRight: '1rem' }}>
              <Image
                src="/common/logo-lightmode.svg"
                alt=""
                priority
                fill
                style={{ objectFit: 'contain', objectPosition: 'left top' }}
              />
          </Box>
        </Flex>
        <Tabs position='relative' variant='unstyled' alignItems={'center'}>
            <TabList gap={8} color={"accent.500"}>
                <Tab as={Link} href="/dashboard" _selected={{ color: 'black' }} _focus={{ boxShadow: 'none', outline: 'none' }}>
                  Strona główna
                </Tab>
                <Tab as={Link} href="/calendar" _selected={{ color: 'black' }} _focus={{ boxShadow: 'none', outline: 'none' }}>
                  Kalendarz
                </Tab>
                <Tab as={Link} href="/groups" _selected={{ color: 'black' }} _focus={{ boxShadow: 'none', outline: 'none' }}>
                  Grupy
                </Tab>
                <Tab as={Link} href="/find-partner" _selected={{ color: 'black' }} _focus={{ boxShadow: 'none', outline: 'none' }}>
                  Szukaj Partnera
                </Tab>
                <Tab as={Link} href="/tools" _selected={{ color: 'black' }} _focus={{ boxShadow: 'none', outline: 'none' }}>
                  Przydatne narzędzia
                </Tab>
            </TabList>
            <TabIndicator mt='-1.5px' height='2px' bg='black' borderRadius='1px' />
        </Tabs>
        <Flex flex={1} justifyContent={"flex-end"} alignItems={"center"}>
          <ProfilePicture size={3.75} />
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<FaAd />}
              variant='outline'
            />
            <MenuList
              minWidth='240px'
              bg='white'
              borderColor='gray.200'
              boxShadow='md'
              borderRadius='md'
              mt={4}
              // zIndex={1000}
              // position={"absolute"}
              // right={-31}
              // top='100%'
            >  
              <MenuItem icon={<FaAd/>} >
                New Tab
              </MenuItem>
              <MenuItem icon={<FaAd/>}>
                New Window
              </MenuItem>
              <MenuItem icon={<FaAd/>}>
                Open Closed Tab
              </MenuItem>
              <MenuItem icon={<FaAd/>}>
                Open File...
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
    </Flex>
  );
}