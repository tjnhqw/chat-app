'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ConvexError } from 'convex/values'
import React, { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import TextareaAutosize from 'react-textarea-autosize';
import { z } from 'zod'
import { Card } from '~/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { api } from '~/convex/_generated/api'
import { useConversation } from '~/hooks/useConverstaion'
import { useMutationState } from '~/hooks/useMutationState'
import { SendHorizonal } from 'lucide-react'
import { Button } from '~/components/ui/button'

type Props = {}

const chatMessageSchema = z.object({
  content: z.string().min(1, { message: 'Message cannot be empty' }),
})
const ChatInput = ({ }: Props) => {

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { conversationId } = useConversation()
  const { mutate: createMessage, pending } = useMutationState(api.message.create)

  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: ''
    }
  })
  const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
    await createMessage({ conversationId, type: 'text', content: [values.content] }).then(() => {
      form.reset()
    }).catch((err) => {
      toast.error(err instanceof ConvexError ? err.data : 'Something went wrong');
    })
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, selectionStart } = e.target;
    if (selectionStart !== null) {
      form.setValue('content', value);
    }
  }

  return (
    <Card className='w-full p-2 relative rounded-lg'>
      <div className='flex gap-2 items-end w-full'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}
            className='flex gap-2 items-end w-full'
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className='h-full w-full'>
                  <FormControl>
                    <TextareaAutosize
                      {...field}
                      rows={1}
                      maxRows={3}
                      onKeyDown={async (e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          await form.handleSubmit(handleSubmit)()
                        }
                      }}
                      onChange={handleInputChange}
                      onClick={() => { }}
                      placeholder='Type a message...'
                      className='min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={pending} size={'icon'} type={'submit'}>
              <SendHorizonal />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  )
}

export default ChatInput