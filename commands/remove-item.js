export default {
  async run({ args, message, store, prefix }) {
    const msg = message.content;
    const itemName = (args[1] && msg.substr(msg.indexOf(args[1]))) || undefined;

    if (message.member.hasPermission('ADMINISTRATOR')) {
      if (!(await store.findOne({ guildID: message.guild.id }))) {
        message.channel.embed({
          type: 'warning',
          description: "You don't even have a store, so you can't remove any item.",
        });
      }

      if (!itemName) {
        showRemovingItemsError(message, prefix);
      } else {
        removeItemFromDatabase(message, store, itemName);
      }
    } else {
      message.channel.embed({
        type: 'warning',
        description: 'Missing permissions.',
      });
    }
  },
};

async function showRemovingItemsError(message, prefix) {
  message.channel.embed({
    type: 'error',
    title: 'Error',
    description:
      'Missing required params or params are incorrect.\n\n' +
      `To check how does this command work please type \`${prefix}remove-item help\``,
  });
}

async function removeItemFromDatabase(message, store, itemName) {
  const allItems = await store.findOne({ guildID: message.guild.id });
  const doesItemExist = await allItems.items.some((item) => item.name === itemName);

  if (doesItemExist) {
    await store.updateOne({ guildID: message.guild.id }, { $pull: { items: { name: itemName } } });

    message.channel.embed({
      type: 'success',
      title: 'New item added',
      description: `**${itemName}** has been removed from store.`,
    });
  } else {
    message.channel.embed({
      type: 'error',
      title: 'Error',
      description: `**${itemName}** does not even exist.`,
    });
  }
}
