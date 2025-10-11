import { GrDatabase } from "react-icons/gr";
import { GiSuits } from "react-icons/gi";
import { TbFlagQuestion, TbSquareLetterBFilled } from "react-icons/tb";
import type { IconType } from "react-icons";

export type ToolName =
  | "bridgeBase"
  | "rpBridge"
  | "simonsConventions"
  | "cuebids";

type Tool = {
  icon: IconType;
  link: string;
};

export const tools: Record<ToolName, Tool> = {
  bridgeBase: {
    icon: TbSquareLetterBFilled,
    link: "https://www.bridgebase.com/",
  },
  rpBridge: {
    icon: TbFlagQuestion,
    link: "http://www.rpbridge.net/",
  },
  simonsConventions: {
    icon: GrDatabase,
    link: "https://www.acblunit390.org/Simon/alpha.htm",
  },
  cuebids: {
    icon: GiSuits,
    link: "https://cuebids.com/login",
  },
};
