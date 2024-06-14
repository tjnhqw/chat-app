import { ConvexError, v } from 'convex/values';
import { mutation } from './_generated/server';
import { getUserByClerkId } from './_utils';

export const create = mutation({
	args: {
		email: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError('Unauthorized');
		}
		if (args.email === identity.email) {
			throw new ConvexError("Can't send request to yourself");
		}

		const currentUser = await getUserByClerkId({
			ctx,
			clerkId: identity.subject,
		});
		if (!currentUser) {
			throw new ConvexError('User not found');
		}

		const receiver = await ctx.db
			.query('users')
			.withIndex('by_email', (q) => q.eq('email', args.email))
			.unique();
		if (!receiver) {
			throw new ConvexError('User could not be found');
		}

		const requestAlreadySent = await ctx.db
			.query('requests')
			.withIndex('by_receiver_sender', (q) =>
				q.eq('receiver', currentUser._id).eq('sender', receiver._id)
			)
			.unique();
		if (requestAlreadySent) {
			throw new ConvexError('Request already sent');
		}
		const request = await ctx.db.insert('requests', {
			sender: currentUser._id,
			receiver: receiver._id,
		});
		return request;
	},
});

export const deny = mutation({
	args: {
		id: v.id('requests'),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError('Unauthorized');
		}
		if (args.id === identity.subject) {
			throw new ConvexError("Can't deny request to yourself");
		}

		const currentUser = await getUserByClerkId({
			ctx,
			clerkId: identity.subject,
		});
		if (!currentUser) {
			throw new ConvexError('User not found');
		}

		const request = await ctx.db.get(args.id);
		if (!request || request.receiver !== currentUser._id) {
			throw new ConvexError('Deny failed');
		}
		await ctx.db.delete(request._id);
		return request;
	},
});

export const accept = mutation({
	args: {
		id: v.id('requests'),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError('Unauthorized');
		}
		if (args.id === identity.subject) {
			throw new ConvexError("Can't deny request to yourself");
		}

		const currentUser = await getUserByClerkId({
			ctx,
			clerkId: identity.subject,
		});
		if (!currentUser) {
			throw new ConvexError('User not found');
		}
		const request = await ctx.db.get(args.id);

		if (!request || request.receiver !== currentUser._id) {
			throw new ConvexError('Accept failed');
		}

		const conversationId = await ctx.db.insert('conversations', {
			isGroup: false,
		});

		await ctx.db.insert('friends', {
			user1: currentUser._id,
			user2: request.sender,
			conversationId: conversationId,
		});

		await ctx.db.insert('conversationMembers', {
			memberId: currentUser._id,
			conversationId: conversationId,
		});

		await ctx.db.insert('conversationMembers', {
			memberId: request.sender,
			conversationId: conversationId,
		});

		await ctx.db.delete(request._id);
	},
});
