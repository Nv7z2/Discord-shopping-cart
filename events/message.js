import user from '$models/User';
import store from '$models/Store';

async function doesUserExist(userID) {
  if (await user.findOne({ userID: userID })) return true;
  else return false;
}

export const run = (client) => {
  client.on('message', async (message) => {
    const prefix = ',';
    const args = message.content.split(' ');
    const commandName = args[0].substr(prefix.length);

    if (message.author.bot || message.channel.type === 'dm') return;

    if (!await doesUserExist(message.author.id)) {
      user.create({ userID: message.author.id });
    }

    if (
      client.commands.has(commandName) &&
      message.content.startsWith(prefix)
    ) {
      if (args[1] === 'help') {
        // message.channel.helpEmbed(prefix, client.user.avatarURL, client.commands.get(commandName).help);
      } else {
        client.commands
          .get(commandName)
          .run({ client, message, args, prefix, user, store });
      }
    }
  });
};
