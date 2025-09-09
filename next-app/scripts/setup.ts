"server-only";

import "./utils/load-env";
import { closeMongodbConnection } from "./utils/close-mongodb-connection";

void (await import("./functions"))
  .setupMasterData()
  .finally(closeMongodbConnection);
