'use client'
import { useQuery } from 'convex/react'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import ConversationContainer from '~/components/conversations/ConversationContainer'
import { api } from '~/convex/_generated/api'
import { Id } from '~/convex/_generated/dataModel'
import Header from './_components/Header'
import Body from './_components/body/Body'
import ChatInput from './_components/input/ChatInput'
import RemoveFriendDialog from './_components/dialogs/RemoveFriendDialog'
import DeleteGroupDialog from './_components/dialogs/DeleteGroupDialog'
import LeaveGroupDialog from './_components/dialogs/LeaveGroupDialog'

type Props = {
  params: {
    conversationId: Id<'conversations'>
  }
}

const ConversationPage = ({ params: { conversationId } }: Props) => {
  const conversation = useQuery(api.conversation.get, {
    id: conversationId
  })
  console.log('conversation: ', conversation);
  const [removeFriendDialog, setRemoveFriendDialog] = useState(false);
  const [deleteGroupDialog, setDeleteGroupDialog] = useState(false);
  const [leaveGroupDialog, setLeaveGroupDialog] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null)
  return (
    <>
      {
        conversation === undefined ?
          <div className='w-full h-full flex justify-center items-center ' id='loading'>
            <Loader2 className='w-8 h-8' /></div> :
          conversation === null ? <p className='text-center'>Conservation not found</p> :
            <ConversationContainer>
              <RemoveFriendDialog conversationId={conversationId} open={removeFriendDialog} setOpen={setRemoveFriendDialog} />
              <DeleteGroupDialog conversationId={conversationId} open={deleteGroupDialog} setOpen={setDeleteGroupDialog} />
              <LeaveGroupDialog conversationId={conversationId} open={leaveGroupDialog} setOpen={setLeaveGroupDialog} />
              <Header imageUrl={conversation.isGroup ? undefined : conversation.otherMember?.imageUrl} name={(conversation.isGroup ? conversation.name : conversation.otherMember?.username) || ''}
                options={conversation.isGroup ? [
                  {
                    label: 'Leave Group',
                    destructive: false,
                    onClick: () => setLeaveGroupDialog(true)
                  },
                  {
                    label: 'Delete Group',
                    destructive: true,
                    onClick: () => setDeleteGroupDialog(true)
                  },
                  {
                    label: 'Remove Friend',
                    destructive: true,
                    onClick: () => setRemoveFriendDialog(true)
                  },

                ] : [
                  {
                    label: 'Remove Friend',
                    destructive: true,
                    onClick: () => setRemoveFriendDialog(true)
                  },
                ]}
              />
              <Body members={conversation.isGroup ?
                conversation.otherMembers ? conversation.otherMembers : [] : conversation.otherMember ? [conversation.otherMember] : []} />
              <ChatInput />
            </ConversationContainer>
      }
    </>

  )
}

export default ConversationPage