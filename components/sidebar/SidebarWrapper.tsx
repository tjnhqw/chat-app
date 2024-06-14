'use client'
import React from 'react'
import DesktopNav from './nav/DesktopNav'
import MobileNav from './nav/MobileNav'
import { useIsMobile } from '~/hooks/useIsMobile'

type Props = React.PropsWithChildren<{}>

const SidebarWrapper = ({ children }: Props) => {
  const isMobile = useIsMobile();
  return (
    <div className='h-full w-full p-4 flex flex-col lg:flex-row gap-4'>
      {isMobile ? <MobileNav /> : <DesktopNav />}
      <main className='h-[calc(100%-80px)] lg:h-full w-full block gap-4 lg:flex relative'>
        {children}
      </main>

    </div>
  )
}

export default SidebarWrapper