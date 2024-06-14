'use client'

import { ConvexError } from 'convex/values';
import React, { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '~/components/ui/alert-dialog';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel'
import { useMutationState } from '~/hooks/useMutationState';
import { leaveGroup } from '../../../../../../convex/conversation';

type DialogProps = {
  conversationId: Id<'conversations'>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LeaveGroupDialog = ({ conversationId, open, setOpen }: DialogProps) => {
  const { mutate: leaveGroup, pending } = useMutationState(api.conversation.leaveGroup)

  const handleLeaveGroup = async () => {
    leaveGroup({ conversationId }).then(() => {
      toast.success('Group leaved successfully')
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
            Are you sure you want to leave this group?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All messages will be deleted. And you are not able to message this group.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={pending} onClick={handleLeaveGroup}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LeaveGroupDialog