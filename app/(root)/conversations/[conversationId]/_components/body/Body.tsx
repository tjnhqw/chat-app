'use client'
import { useQuery } from 'convex/react'
import React, { use, useEffect } from 'react'
import { api } from '~/convex/_generated/api'
import { Id } from '~/convex/_generated/dataModel'
import { useConversation } from '~/hooks/useConverstaion'
import Message from './Message'
import { useMutationState } from '~/hooks/useMutationState'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'

type Props = {
  members: {
    lastSeemMessageId?: Id<'messages'>;
    username?: string;
    [key: string]: any
  }[]
}

const Body = ({ members }: Props) => {
  const { conversationId } = useConversation()
  const messages = useQuery(api.messages.get, {
    id: conversationId as Id<'conversations'>
  })


  const { mutate: markRead, } = useMutationState(api.conversation.markRead)


  useEffect(() => {
    if (messages && messages.length > 0) {
      markRead({
        conversationId,
        messageId: messages[0].message._id
      })
    }

  }, [messages?.length, conversationId, markRead])


  const formatSeenBy = (names: string[]) => {
    switch (names.length) {
      case 1:
        return (
          <p className='text-sm text-muted-foreground text-gray-500 text-right'>{`Seen by ${names[0]}`}</p>
        )
      case 2:
        return (
          <p className='text-sm text-muted-foreground text-gray-500 text-right'>{`Seen by ${names[0]} and ${names[1]}`}</p>
        )
      default:
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <p className='text-sm text-muted-foreground text-gray-500 text-right'>{`Seen by ${names[0]}, ${names[1]}, and ${names.length - 2} others}`}</p>
              </TooltipTrigger>
              <TooltipContent>
                <ul>
                  {names.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
    }

  }
  const getSeemMessage = (messageId: Id<'messages'>) => {
    const seenUsers = members.filter(member => member.lastSeemMessageId === messageId)
      .map((user) => user.username!.split('')[0])

    if (seenUsers.length === 0) return undefined

    return formatSeenBy(seenUsers);
  }
  return (
    <div className='flex-1 w-full flex overflow-scroll flex-col-reverse gap-2 p-3 no-scrollbar'>
      {
        messages?.map(({ message, senderImage, senderName, isCurrentUser }, index) => {
          const lastByUser = messages[index - 1]?.message.senderId === messages[index].message.senderId
          return (
            <Message key={message._id}
              lastByUser={lastByUser}
              content={message.content}
              senderImage={senderImage}
              senderName={senderName}
              fromCurrentUser={isCurrentUser}
              createAt={message._creationTime}
              type={message.type}
              seen={getSeemMessage(message._id)}
            />
          )
        })
      }
    </div>
  )
}

export default Body