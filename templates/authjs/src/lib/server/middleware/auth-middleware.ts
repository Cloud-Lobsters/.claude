// src/lib/server/middleware/auth-middleware.ts
import type { Handle } from "@sveltejs/kit";

/**
 * Authentication middleware
 * Handles session management, route protection, and user authorization
 */
export const authMiddleware: Handle = async ({ event, resolve }) => {
    // Get session from Auth.js
    const session = await event.locals.auth();

    // Populate locals.user for easy access
    if (session?.user) {
        event.locals.user = session.user;
    }

    // Protect dashboard routes - redirect unauthenticated users to sign-in
    if (event.url.pathname.startsWith('/dashboard') && !session?.user) {
        return new Response(null, {
            status: 302,
            headers: { location: '/signin' }
        });
    }

    // Restrict external users to project routes only
    if (session?.user && (session.user as any).isExternal === true) {
        const pathname = event.url.pathname;

        // Allow only project-related routes for external users
        const allowedRoutes = [
            '/dashboard',
            '/dashboard/projects',
        ];

        const isAllowedRoute =
            allowedRoutes.includes(pathname) ||
            pathname.startsWith('/dashboard/projects/') ||
            pathname.startsWith('/api/');

        if (!isAllowedRoute) {
            return new Response(null, {
                status: 302,
                headers: { location: '/dashboard/projects' }
            });
        }
    }

    // Redirect authenticated users from root to dashboard
    if (event.url.pathname === '/' && session?.user) {
        return new Response(null, {
            status: 302,
            headers: { location: '/dashboard' }
        });
    }

    return resolve(event);
};
