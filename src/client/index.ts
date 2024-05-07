import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from "../server/index.js";
//     👆 **type-only** import

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.

export function newTRPC(ip: string, port: number) {
  const trpc = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `http://${ip}:${port}`,
      }),
    ],
  });
  return { trpc };
}



