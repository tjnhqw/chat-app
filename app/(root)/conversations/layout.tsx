'use client'
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import ItemList from '~/components/item-list/ItemList';
import { api } from '~/convex/_generated/api';
import DMConversationItem from './_components/DMConversationItem';
import CreateGroupDialog from './_components/CreateGroupDialog';
import GroupConversationItem from './_components/GroupConversationItem';

type Props = React.PropsWithChildren<{}>

function ConversationsLayout({ children }: Props) {
  const conversations = useQuery(api.conversations.get)
  return (
    <>
      <ItemList title='Conversations' action={<CreateGroupDialog />}>
        <>
          {
            conversations ? (
              conversations.length === 0 ? (
                <p>No conversations</p>
              ) : (
                conversations.map((conversations) => {
                  return conversations.conversation.isGroup ?
                    <GroupConversationItem
                      key={conversations.conversation._id}
                      id={conversations.conversation._id}
                      name={conversations.conversation.name || ''}
                      lastMessageSender={conversations.lastMessage?.sender}
                      lastMessageContent={conversations.lastMessage?.content}
                      lastMessageTime={conversations.lastMessage?.timestamp}
                      unseenMessage={conversations.unseen}
                    /> : (
                      <DMConversationItem
                        key={conversations.conversation._id}
                        id={conversations.conversation._id}
                        username={conversations.otherMember?.username || ''}
                        imageUrl={conversations.otherMember?.imageUrl || ''}
                        lastMessageSender={conversations.lastMessage?.sender}
                        lastMessageContent={conversations.lastMessage?.content}
                        lastMessageTime={conversations.lastMessage?.timestamp}
                        unseenMessage={conversations.unseen}
                      />
                    )
                })
              )
            ) : (<Loader2 />)
          }
        </>
      </ItemList>
      {children}
    </>
  )
}

export default ConversationsLayout