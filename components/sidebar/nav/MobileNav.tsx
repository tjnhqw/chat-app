'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Card } from '~/components/ui/card'
import { Tooltip, TooltipContent } from '~/components/ui/tooltip'
import { Button } from '~/components/ui/button'
import { ModeToggle } from '~/components/ui/theme/theme-toggle'

import { useNavigation } from '~/hooks/useNavigation'
import { Badge } from '~/components/ui/badge'

const MobileNav = () => {
  const paths = useNavigation()


  return (
    <Card className='fixed bottom-4 left-0 md:w-[calc(100vw-32px)] flex items-center h-16 p-2 lg:hidden w-full'>
      <nav className='w-full'>
        <ul className='flex items-center justify-evenly'>
          {paths.map((path, index) => {
            return (
              <li key={index} className='relative'>
                <Link href={path.href}>
                  <Tooltip>
                    <Button size={'icon'} variant={path.active ? 'default' : 'outline'}>
                      {path.icon}
                      {path.count ?
                        <Badge className='absolute left-6 bottom-7 px-2'>{path.count}</Badge>
                        : null}
                    </Button>
                    <TooltipContent>
                      <p>{path.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </Link>
              </li>
            )
          })}
          <li>
            <ModeToggle />
          </li>
          <li>
            <Button size={'icon'} variant={'ghost'}>
              <UserButton />
            </Button>
          </li>

        </ul>
      </nav>

    </Card>
  )
}

export default MobileNav