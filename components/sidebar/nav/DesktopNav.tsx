import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Card } from '~/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { Button } from '~/components/ui/button'
import { useNavigation } from '~/hooks/useNavigation'
import { ModeToggle } from '~/components/ui/theme/theme-toggle'
import { Badge } from '~/components/ui/badge'


const DesktopNav = () => {
  const paths = useNavigation()
  return (
    <Card className='hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-5'>
      <nav>
        <ul className='flex flex-col items-center gap-4'>
          {paths.map((path, index) => {
            return (
              <li key={index} className='relative'>
                <Link href={path.href}>
                  <Tooltip>
                    <TooltipTrigger asChild >
                      <Button size={'icon'} variant={path.active ? 'default' : 'outline'} >
                        {path.icon}
                        {path.count ?
                          <Badge className='absolute left-6 bottom-7 px-2'>{path.count}</Badge>
                          : null}
                      </Button>

                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{path.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className='flex flex-col items-center gap-4 mb-4'>
        <ModeToggle />
        <UserButton />
      </div>
    </Card>
  )
}

export default DesktopNav