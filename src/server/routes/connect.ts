import { publicProcedure } from "../trpc.js";
import { clientUserInfo } from "../../schema/userInfo.js";
import { UserInfo } from "../../schema/userInfo.js";

export const tryConnect = publicProcedure
  .input(clientUserInfo)
  .query(async (opts) => {
    const user = opts.input;
    console.log(user);
  });
