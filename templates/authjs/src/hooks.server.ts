// src/hooks.server.ts
import { handle as authHandle } from "$lib/server/auth";
import { authMiddleware } from "$lib/server/middleware/auth-middleware";
import { sequence } from "@sveltejs/kit/hooks";

// Chain Auth.js handler with route protection middleware
export const handle = sequence(authHandle, authMiddleware);
