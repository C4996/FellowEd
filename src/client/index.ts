import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from "../server";
//     👆 **type-only** import

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.

export function newTRPC(port: number) {
  const trpc = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: "http://localhost:41131",
      }),
    ],
  });
  return { trpc };
}
