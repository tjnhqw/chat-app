'use client'
import { useState } from 'react'
import { useMutation } from 'convex/react'

export const useMutationState = (mutationToRun: any) => {
  const [pending, setPending] = useState(false);
  const mutationFn = useMutation(mutationToRun);

  const mutate = (payload: any) => {
    setPending(true);

    return mutationFn(payload).then(
      res => {
        return res
      }).catch(err => {
        throw err
      }).finally(() => {
        setPending(false);
      });
  };

  return {
    mutate,
    pending
  }
}