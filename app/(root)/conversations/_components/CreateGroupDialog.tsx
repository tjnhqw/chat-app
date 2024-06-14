'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu';
import { useQuery } from 'convex/react'
import { ConvexError, v } from 'convex/values';
import { CirclePlus, X } from 'lucide-react'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { api } from '~/convex/_generated/api'
import { useMutationState } from '~/hooks/useMutationState'

type Props = {}

const groupFormSchema = z.object({
  name: z.string().min(1, { message: 'Group name is required' }),
  members: z.array(z.string()).min(1, { message: 'Select at least one member' })
})

const CreateGroupDialog = (props: Props) => {
  const friends = useQuery(api.friends.get);

  const { mutate: createGroup, pending } = useMutationState(api.conversation.createGroup);


  const form = useForm<z.infer<typeof groupFormSchema>>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: '',
      members: []
    }
  })
  const members = form.watch('members', [])
  const unselectedFriends = useMemo(() => {
    return friends ? friends.filter(friend => !members.includes(friend._id)) : []

  }, [members.length, friends?.length])

  const handleSubmit = async (value: z.infer<typeof groupFormSchema>) => {
    await createGroup({
      name: value.name,
      members: value.members
    }).then(() => {
      form.reset()
      toast.success('Group created successfully')
    }).catch(error => {
      toast.error(error instanceof ConvexError ? error.data : 'Something went wrong')
    })
  }

  return (
    <Dialog >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size={'icon'} variant={'outline'}>
            <DialogTrigger asChild>
              <CirclePlus />
            </DialogTrigger>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create group</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className='block'>
        <DialogHeader>
          <DialogTitle>Create group</DialogTitle>
          <DialogDescription>Add your friends to create a group</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormField control={form.control}
              name='name' render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Group name</FormLabel>
                    <FormControl>
                      <Input placeholder='Group name' {...field} />
                    </FormControl>
                  </FormItem>
                )
              }}
            />
            <FormField control={form.control}
              name='members' render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Friends</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={unselectedFriends.length === 0}>
                          <Button className='w-full' variant={'outline'}>Select</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-full'>
                          {
                            unselectedFriends.map((friend) => {
                              return (
                                <DropdownMenuCheckboxItem key={friend._id}
                                  className='w-full flex items-center gap-2 p-2'
                                  onCheckedChange={checked => {
                                    if (checked) {
                                      form.setValue('members', [...members, friend._id])
                                    }

                                  }}>
                                  <Avatar className='h-8 w-8'>
                                    <AvatarImage src={friend.imageUrl} />
                                    <AvatarFallback>
                                      {friend.username.substring(0, 1)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <h4 className='truncate'>{friend.username}</h4>
                                </DropdownMenuCheckboxItem>
                              )
                            })
                          }

                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            {
              members && members.length > 0 ? (
                <Card className='flex items-center overflow-x-auto w-full h-24 no-scrollbar gap-3 p-2'>
                  {
                    friends?.filter(friend => members.includes(friend._id)).map(friend => {
                      return (
                        <div className='flex flex-col items-center gap-1' key={friend._id}>
                          <div className='relative'>
                            <Avatar className='h-8 w-8'>
                              <AvatarImage src={friend.imageUrl} />
                              <AvatarFallback>
                                {friend.username.substring(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <X className='text-muted-foreground w-4 h-4 absolute bottom-8 left-7 bg-muted rounded-full cursor-pointer'
                              onClick={() => {
                                form.setValue('members', members.filter(id => id !== friend._id))
                              }}
                            />
                          </div>
                          <p className='truncate'>{friend.username.split(' ')[0]}</p>
                        </div>
                      )
                    })
                  }

                </Card>
              ) : null
            }
            <DialogFooter>
              <Button disabled={pending} type='submit'>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateGroupDialog