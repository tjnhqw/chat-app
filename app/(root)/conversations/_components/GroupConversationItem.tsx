import Link from 'next/link';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Card } from '~/components/ui/card';
import { Id } from '~/convex/_generated/dataModel'

type Props = {
  id: Id<'conversations'>;
  name: string;
  lastMessageContent?: string;
  lastMessageSender?: string;
  lastMessageTime?: number;
  unseenMessage?: number;
}

const GroupConversationItem = ({ id, name, lastMessageContent, lastMessageSender, lastMessageTime, unseenMessage }: Props) => {
  return (
    <Link href={`/conversations/${id}`} className='w-full'>
      <Card className='p-2 flex flex-row items-center justify-between gap-4 truncate'>
        <div className='flex flex-row gap-4 items-center'>
          <Avatar>
            <AvatarFallback>
              {name.charAt(0).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col truncate'>
            <h4 className='truncate'>{name}</h4>
            {
              lastMessageSender && lastMessageContent ?
                <span className='text-sm text-muted-foreground flex truncate overflow-ellipsis whitespace-nowrap'>
                  <p className='font-semibold'>{lastMessageSender}{':'}&nbsp;</p>
                  <p className='truncate overflow-ellipsis'>
                    {lastMessageContent}</p>
                </span>
                :
                <p className='text-gray-500 text-sm'>Start the conversation!</p>
            }
          </div>
        </div>
        {
          unseenMessage ? <Badge>{unseenMessage}</Badge> : null
        }
      </Card>

    </Link>
  )
}

export default GroupConversationItem