'use client'
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SidebarWrapper from '~/components/sidebar/SidebarWrapper';

type Props = React.PropsWithChildren<{}>

function Layout({ children }: Props) {

  const { isSignedIn } = useAuth();
  const router = useRouter()

  useEffect(() => {
    if (!isSignedIn) router.push('/')
  }, [isSignedIn, router])

  return (
    <SidebarWrapper>
      {children}
    </SidebarWrapper>
  )
}

export default Layout