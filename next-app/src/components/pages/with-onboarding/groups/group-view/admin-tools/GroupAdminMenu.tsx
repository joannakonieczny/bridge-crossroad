"use client";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
} from "@chakra-ui/react";
import {
  FiChevronDown,
  FiSettings,
  FiEdit2,
  FiUserPlus,
  FiUserX,
} from "react-icons/fi";
import { useTranslations } from "@/lib/typed-translations";
import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import AddRemoveAdminModal from "./AddRemoveAdminModal";
import { CreateModifyGroupModal } from "../../CreateModifyGroupModal";
import type { GroupFullType } from "@/schemas/model/group/group-types";

type GroupAdminMenuProps = {
  group: GroupFullType;
};

export default function GroupAdminMenu({ group }: GroupAdminMenuProps) {
  const t = useTranslations("pages.GroupsPage.GroupBanner");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [addRemoveAdminMode, setAddRemoveAdminMode] = useState<
    "add" | "remove"
  >("add");

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<FiChevronDown />}
          leftIcon={<FiSettings />}
          size="sm"
          variant="outline"
          borderRadius="lg"
          colorScheme="accent"
          px={4}
        >
          {t("admin.menuLabel")}
        </MenuButton>
        <MenuList>
          <MenuItem icon={<Icon as={FiEdit2} />} onClick={onEditOpen}>
            {t("admin.menu.editGroup")}
          </MenuItem>
          <MenuItem
            icon={<Icon as={FiUserPlus} color="green.500" />}
            onClick={() => {
              setAddRemoveAdminMode("add");
              onOpen();
            }}
          >
            {t("admin.menu.addAdmin")}
          </MenuItem>
          <MenuItem
            icon={<Icon as={FiUserX} color="red.500" />}
            onClick={() => {
              setAddRemoveAdminMode("remove");
              onOpen();
            }}
          >
            {t("admin.menu.removeAdmin")}
          </MenuItem>
        </MenuList>
      </Menu>

      <AddRemoveAdminModal
        isOpen={isOpen}
        onClose={onClose}
        mode={addRemoveAdminMode}
        group={group}
      />
      <CreateModifyGroupModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        mode="modify"
        groupId={group.id}
        initialData={{
          name: group.name,
          description: group.description,
          imageUrl: group.imageUrl,
        }}
      />
    </>
  );
}
