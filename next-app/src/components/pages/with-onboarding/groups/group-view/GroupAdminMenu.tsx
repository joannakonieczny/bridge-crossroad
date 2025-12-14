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

export default function GroupAdminMenu() {
  const t = useTranslations("pages.GroupsPage.GroupBanner");

  return (
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
        <MenuItem icon={<Icon as={FiEdit2} />}>
          {t("admin.menu.editGroup")}
        </MenuItem>
        <MenuItem icon={<Icon as={FiUserPlus} color="green.500" />}>
          {t("admin.menu.addAdmin")}
        </MenuItem>
        <MenuItem icon={<Icon as={FiUserX} color="red.500" />}>
          {t("admin.menu.removeAdmin")}
        </MenuItem>
        <MenuItem icon={<Icon as={FiUserPlus} color="green.500" />}>
          {t("admin.menu.addMember")}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
