import { ConvexError } from 'convex/values';
import { MutationCtx, query, QueryCtx } from './_generated/server';
import { getUserByClerkId } from './_utils';
import { Id } from './_generated/dataModel';



export const get = query({
  args: {},
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new ConvexError('Unauthorized');
      }
      const currentUser = await getUserByClerkId({
        ctx,
        clerkId: identity.subject,
      });
      if (!currentUser) {
        throw new ConvexError('User not found');
      }

      const conversationMemberships = await ctx.db.query('conversationMembers')
        .withIndex('by_memberId', q => q.eq('memberId', currentUser._id))
        .collect();

      if (!conversationMemberships) throw new ConvexError('No conversations found');

      const conversations = await Promise.all(conversationMemberships?.map(
        async (membership) => {
          const conversation = await ctx.db.get(membership.conversationId);
          if (!conversation) {
            throw new ConvexError('Conversation not found');
          }
          return conversation;
        }
      ))

      const conversationsWithDetails = await Promise.all(
        conversations.map(async (conversation, index) => {
          const allConversationMemberships = await ctx.db.query('conversationMembers')
            .withIndex('by_conversationId', q => q.eq('conversationId', conversation._id))
            .collect();


          const lastMessage = await getLastMessageDetails({ ctx, id: conversation.lassMessageId })
          const lastSeenMessage = conversationMemberships[index].lastSeenMessage ? await ctx.db.get(conversationMemberships[index].lastSeenMessage!) : null;
          const lastSeenMessageTime = lastSeenMessage ? lastSeenMessage._creationTime : -1;
          const unseenMessage = await ctx.db.query('messages')
            .withIndex('by_conversationId', q => q.eq('conversationId', conversation._id))
            .filter((q) => q.gt(q.field('_creationTime'), lastSeenMessageTime))
            .filter(q => q.neq(q.field('senderId'), currentUser._id))
            .collect();

          if (conversation.isGroup) {
            return {
              conversation,
              lastMessage,
              unseen: unseenMessage.length
            }
          } else {
            const otherMembership = allConversationMemberships.filter((membership) => membership.memberId !== currentUser._id)[0]
            const otherMember = await ctx.db.get(otherMembership.memberId)
            return {
              conversation,
              otherMember,
              lastMessage,
              unseen: unseenMessage.length
            }

          }
        })
      );

      return conversationsWithDetails;
    } catch (error) {
      console.log('error: ', error);
    }
  }
})


const getLastMessageDetails = async ({ ctx, id }: { ctx: QueryCtx | MutationCtx, id: Id<'messages'> | undefined }) => {
  if (!id) return null
  const message = await ctx.db.get(id)
  if (!message) return null
  const sender = await ctx.db.get(message.senderId)
  if (!sender) return null

  const content = getMessageContent(message.type, message.content as unknown as string)
  return { content, sender: sender.username, timestamp: message._creationTime }

}
const getMessageContent = (type: string, content: string) => {
  switch (type) {
    case 'text':
      return content
    case 'image':
      return 'Image'
    case 'video':
      return 'Video'
    case 'audio':
      return 'Audio'
    default:
      return 'Unknown type content'
  }
}