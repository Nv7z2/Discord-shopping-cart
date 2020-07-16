export const run = (client) => {
	client.once('ready', () => {
		console.log(`${client.user.username} is logged in..`);
	});
};