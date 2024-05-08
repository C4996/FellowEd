// import { initTRPC } from '@trpc/server';
// import { initTRPC } = require("@trpc/server");
import trpcServer = require("@trpc/server");
const initTRPC = trpcServer.initTRPC;

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
