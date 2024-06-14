"use client"
import { useConvexAuth } from 'convex/react';
import ItemList from '~/components/item-list/ItemList';
import AddFriendDialog from './_components/AddFriendDialog';
import ConversationFallback from '~/components/conversations/ConversationFallback';
import { redirect } from 'next/navigation';

type Props = React.PropsWithChildren<{
  name: string;
}>

function FriendsLayout({ children }: Props) {
  const { isAuthenticated } = useConvexAuth()
  if (!isAuthenticated) return redirect('/conversations')
  return (
    <>
      <ItemList title='Friends' action={<AddFriendDialog />}>
        {children}
      </ItemList>
      <ConversationFallback />

    </>
  )
}

export default FriendsLayout