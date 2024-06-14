'use client'
import React from 'react'
import { Card } from '../ui/card'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'


const ConversationFallback = () => {
  return (
    <Card className='hidden h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground lg:flex'>
      <SignedOut>
        <SignInButton mode='modal' />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>

    </Card>
  )
}

export default ConversationFallback