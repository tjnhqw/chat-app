import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getUserByClerkId } from './_utils';

export const get = query({
	args: {
		id: v.id('conversations'),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error('Not authenticated');

		const currentUser = await getUserByClerkId({
			ctx,
			clerkId: identity.subject,
		});
		if (!currentUser) throw new ConvexError('User not found');

		const conversation = await ctx.db.get(args.id);
		if (!conversation) throw new ConvexError('Conversation not found');

		const membership = await ctx.db
			.query('conversationMembers')
			.withIndex('by_member_conversationId', (q) =>
				q.eq('memberId', currentUser._id).eq('conversationId', conversation._id)
			)
			.unique();
		if (!membership) throw new ConvexError('Not a member of this conversation');

		const allConversationMembership = await ctx.db
			.query('conversationMembers')
			.withIndex('by_conversationId', (q) => q.eq('conversationId', args.id))
			.collect();

		if (!conversation.isGroup) {
			const otherMembership = allConversationMembership.filter(
				(membership) => membership.memberId !== currentUser._id
			);

			const otherMemberDetails = await ctx.db.get(otherMembership[0].memberId);

			return {
				...conversation,
				otherMember: {
					...otherMemberDetails,
					lastSeemMessageId: otherMembership[0].lastSeenMessage,
				},
				otherMembers: null,
			};
		} else {
			const otherMembers = await Promise.all(
				allConversationMembership
					.filter((membership) => membership.memberId !== currentUser._id)
					.map(async (membership) => {
						const member = await ctx.db.get(membership.memberId);
						if (!member) throw new ConvexError('User not found');

						return {
							_id: member._id,
							username: member.username,
							lastSeemMessageId: membership.lastSeenMessage,
						};
					})
			);
			return {
				...conversation,
				otherMembers,
				otherMember: null,
			};
		}
	},
});

export const createGroup = mutation({
	args: {
		name: v.string(),
		members: v.array(v.id('users')),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error('Not authenticated');

		const currentUser = await getUserByClerkId({
			ctx,
			clerkId: identity.subject,
		});
		if (!currentUser) throw new ConvexError('User not found');

		const conversationId = await ctx.db.insert('conversations', {
			name: args.name,
			isGroup: true,
		});

		await Promise.all(
			[...args.members, currentUser._id].map(async (memberId) => {
				await ctx.db.insert('conversationMembers', {
					memberId,
					conversationId,
				});
			})
		);
	},
});

export const deleteGroup = mutation({
	args: {
		conversationId: v.id('conversations'),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error('Not authenticated');

		const currentUser = await getUserByClerkId({
			ctx,
			clerkId: identity.subject,
		});
		if (!currentUser) throw new ConvexError('User not found');

		const conversation = await ctx.db.get(args.conversationId);
		if (!conversation) throw new ConvexError('Conversation not found');

		const memberships = await ctx.db
			.query('conversationMembers')
			.withIndex('by_conversationId', (q) =>
				q.eq('conversationId', args.conversationId)
			)
			.collect();

		if (!memberships || memberships.length <= 1) {
			throw new ConvexError('This conversation is not a 2-person conversation');
		}

		const messages = await ctx.db
			.query('messages')
			.withIndex('by_conversationId', (q) =>
				q.eq('conversationId', args.conversationId)
			)
			.collect();

		await ctx.db.delete(args.conversationId);

		await Promise.all(
			memberships.map(async (membership) => {
				await ctx.db.delete(membership._id);
			})
		);

		await Promise.all(
			messages.map(async (message) => {
				await ctx.db.delete(message._id);
			})
		);
	},
});

export const leaveGroup = mutation({
	args: {
		conversationId: v.id('conversations'),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error('Not authenticated');

		const currentUser = await getUserByClerkId({
			ctx,
			clerkId: identity.subject,
		});
		if (!currentUser) throw new ConvexError('User not found');

		const conversation = await ctx.db.get(args.conversationId);
		if (!conversation) throw new ConvexError('Conversation not found');

		const membership = await ctx.db
			.query('conversationMembers')
			.withIndex('by_member_conversationId', (q) =>
				q
					.eq('memberId', currentUser._id)
					.eq('conversationId', args.conversationId)
			)
			.unique();

		if (!membership) {
			throw new ConvexError('This conversation is not a 2-person conversation');
		}

		await ctx.db.delete(membership._id);
	},
});

export const markRead = mutation({
	args: {
		conversationId: v.id('conversations'),
		messageId: v.optional(v.id('messages')),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error('Not authenticated');

		const currentUser = await getUserByClerkId({
			ctx,
			clerkId: identity.subject,
		});
		if (!currentUser) throw new ConvexError('User not found');

		const membership = await ctx.db
			.query('conversationMembers')
			.withIndex('by_member_conversationId', (q) =>
				q
					.eq('memberId', currentUser._id)
					.eq('conversationId', args.conversationId)
			)
			.unique();

		if (!membership) {
			throw new ConvexError('This conversation is not a 2-person conversation');
		}

		const lastMessage = await ctx.db.get(args.messageId!);

		await ctx.db.patch(membership._id, {
			lastSeenMessage: lastMessage ? lastMessage._id : undefined,
		});
	},
});
