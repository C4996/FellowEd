import { publicProcedure } from "../trpc";
import db from "../../db";

export const getAllUsers = publicProcedure.query(async () => {
  return db.user.getAllData();
});
