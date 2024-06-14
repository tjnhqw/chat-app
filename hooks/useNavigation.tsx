'use client'
import { useQuery } from 'convex/react';
import { MessageSquare, Users } from 'lucide-react';
import { usePathname } from 'next/navigation'
import { useMemo } from 'react';
import { api } from '~/convex/_generated/api';


export const useNavigation = () => {
  const pathname = usePathname();
  const requestCount = useQuery(api.requests.count)!
  const conversations = useQuery(api.conversations.get)!

  const unseenMessage = useMemo(() => {
    if (conversations) {
      return conversations.reduce((acc, conversation) => {
        return acc + conversation.unseen;
      }, 0)
    }
  }, [conversations])
  const paths = useMemo(() => [
    {
      name: 'Conversations',
      href: '/conversations',
      icon: <MessageSquare />,
      active: pathname.startsWith('/conversations'),
      count: unseenMessage
    },
    {
      name: 'Friends',
      href: '/friends',
      icon: <Users />,
      active: pathname === '/friends',
      count: requestCount
    }
  ], [pathname, requestCount, unseenMessage]);

  return paths;
}