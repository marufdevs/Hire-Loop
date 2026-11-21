import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

import type { auth } from "@/lib/auth"

export const authClient = createAuthClient({
  // No baseURL: the client talks to the same origin that serves /api/auth.
  plugins: [inferAdditionalFields<typeof auth>()],
})

export const { signIn, signUp, signOut, useSession } = authClient
