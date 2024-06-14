import React from 'react'
import { Card } from '../ui/card'

type Props = React.PropsWithChildren<{}>

const ConversationContainer = ({ children }: Props) => {
  return (
    <Card className='h-[calc(100svh-32px)] w-full lg:h-full p-2 flex-col gap-2 lg:flex flex lg:relative top-0 absolute'>
      {children}
    </Card>
  )
}

export default ConversationContainer