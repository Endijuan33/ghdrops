'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function AuthButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p>Signed in as {session.user?.name}</p>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
    )
  }
  return <Button onClick={() => signIn('github')}>Sign In with GitHub</Button>
}
