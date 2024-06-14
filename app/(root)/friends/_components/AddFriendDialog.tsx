'use client'
import { z } from 'zod'
import React, { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ConvexError } from 'convex/values'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { useMutationState } from '~/hooks/useMutationState'
import { api } from '~/convex/_generated/api'


const addFriendFromSchema = z.object({
  email: z.string().min(1, 'Please enter an email address').email('Please enter a valid email address'),
})
const AddFriendDialog = () => {
  const { mutate: createRequest, pending } = useMutationState(api.request.create)
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof addFriendFromSchema>>({
    resolver: zodResolver(addFriendFromSchema),
    defaultValues: {
      email: '',
    }
  })
  async function onSubmit(values: z.infer<typeof addFriendFromSchema>) {
    await createRequest({ email: values.email })
      .then(() => {
        form.reset()
        toast.success('Request sent!')

      })
      .catch((error) => {
        toast.error(error instanceof ConvexError ? error.data : 'Something went wrong')
        console.log(error);
      })
      .finally(() => {
        setOpen(false)
      })


  }
  function onOpenChangeDialog() {
    setOpen(false);
    if (form.formState.errors) {
      form.reset()
    }
  }

  return (
    <Dialog onOpenChange={onOpenChangeDialog} open={open}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size={'icon'} variant={'outline'} onClick={() => setOpen(true)} >
            <DialogTrigger asChild>
              <UserPlus />
            </DialogTrigger>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add friend</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add friend
          </DialogTitle>
          <DialogDescription>
            Send a request to connect with your friends!
          </DialogDescription>
          <DialogClose asChild>
          </DialogClose>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email..." {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={pending}>Send</Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}

export default AddFriendDialog