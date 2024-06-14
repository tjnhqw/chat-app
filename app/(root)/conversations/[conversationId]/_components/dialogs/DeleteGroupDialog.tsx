'use client'

import { ConvexError } from 'convex/values';
import React, { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '~/components/ui/alert-dialog';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel'
import { useMutationState } from '~/hooks/useMutationState';

type DialogProps = {
  conversationId: Id<'conversations'>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const DeleteGroupDialog = ({ conversationId, open, setOpen }: DialogProps) => {
  const { mutate: deleteGroup, pending } = useMutationState(api.conversation.deleteGroup)

  const handleDeleteGroup = async () => {
    deleteGroup({ conversationId }).then(() => {
      toast.success('Group removed')
      setOpen(false)
    }).catch((err) => {
      toast.error(err instanceof ConvexError ? err.data : 'Something went wrong');
    })
  }


  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this group?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All messages will be deleted. And you are not able to message this group.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={pending} onClick={handleDeleteGroup}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteGroupDialog