import { httpRouter } from 'convex/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';

import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
const http = httpRouter();

const validatePayload = async (
	req: Request
): Promise<WebhookEvent | undefined> => {
	const payload = await req.text();
	const svixHeaders = {
		'svix-id': req.headers.get('svix-id')!,
		'svix-timestamp': req.headers.get('svix-timestamp')!,
		'svix-signature': req.headers.get('svix-signature')!,
	};
	console.log(
		'process.env.CLERK_WEBHOOK_SECRET: ',
		process.env.CLERK_WEBHOOK_SECRET
	);
	const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET! || '');
	try {
		const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
		return event;
	} catch (error) {
		console.log('error webhook clerk:: ', error);
		return undefined;
	}
};
const handleClerkWebhook = httpAction(async (ctx, req) => {
	const event = await validatePayload(req);
	if (!event) {
		return new Response('Could not validate clerk payload', { status: 400 });
	}
	switch (event.type) {
		case 'user.created':
			const user = await ctx.runQuery(internal.user.get, {
				clerkId: event.data.id,
			});
			if (user) {
				console.log(`Updating user ${event.data.id} with ${event.data}`);
				break;
			}
		case 'user.updated':
			await ctx.runMutation(internal.user.create, {
				clerkId: event.data.id,
				username: `${event.data.first_name || event.data.email_addresses[0].email_address!}`,
				imageUrl: event.data.image_url!,
				email: event.data.email_addresses[0].email_address!,
			});
			break;
		default:
			console.log(`Unhandled event clerk webhook type ${event.type}`);
	}

	return new Response(null, { status: 200 });
});
http.route({
	path: '/clerk-users-webhook',
	method: 'POST',
	handler: handleClerkWebhook,
});

export default http;
