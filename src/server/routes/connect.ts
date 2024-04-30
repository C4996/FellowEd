import { publicProcedure } from "../trpc";
import { clientUserInfo } from "../../schema/userInfo";
import { UserInfo } from "../../schema/userInfo";

export const tryConnect = publicProcedure
  .input(clientUserInfo)
  .query(async (opts) => {
    const user = opts.input;
    console.log(user);
  });
