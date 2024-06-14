"use client"
import { Loader2 } from 'lucide-react'
import ConversationFallback from '~/components/conversations/ConversationFallback'
import ItemList from '~/components/item-list/ItemList'
import AddFriendDialog from './_components/AddFriendDialog'
import { useQuery } from 'convex/react'
import { api } from '~/convex/_generated/api'
import Request from './_components/Request'

type Props = {}

function FriendsPage(props: Props) {
  const requests = useQuery(api.requests.get)
  return (
    <>
      {
        requests ? requests.length === 0 ? (
          <p className='text-center'>No friends request found</p>
        ) : (
          <>
            {requests.map((request) => (
              <Request
                key={request._id}
                id={request._id}
                imageUrl={request.sender.imageUrl}
                username={request.sender.username}
                email={request.sender.email}
              />
            ))}
          </>
        ) : (
          <Loader2 className='h-8 w-8' />
        )
      }
    </>
  )
}

export default FriendsPage