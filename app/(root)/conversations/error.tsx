'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ConversationFallback from '~/components/conversations/ConversationFallback'

type Props = {
  error: Error
}

const Error = (props: Props) => {
  console.log('props: ', props);

  const router = useRouter();

  useEffect(() => {

    router.push('/')
  }, [props.error, router])


  return <ConversationFallback />
}

export default Error