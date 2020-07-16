export default {
  async run({ args, message, store, prefix }) {
    const msg = message.content;
    const itemPrice = parseInt(args[1]) || undefined;
    const itemName = (args[2] && msg.substr(msg.indexOf(args[2]))) || undefined;

    if (message.member.hasPermission('ADMINISTRATOR')) {
      await createStoreIfNotExist(store, message);

      if (!itemName || !itemPrice) {
        showAddingItemsError(message, prefix);
      } else {
        addItemToDatabase(message, store, itemPrice, itemName);
      }
    } else {
      message.channel.embed({
        type: 'warning',
        description: 'Missing permissions.',
      });
    }
  },
};

async function createStoreIfNotExist(store, message) {
  if (!(await store.findOne({ guildID: message.guild.id }))) {
    const creatingStoreMessage = await message.channel.send(
      "Store for this server doesn't exist yet.\nWait a second, creating one..."
    );

    await store.create({ guildID: message.guild.id });
    creatingStoreMessage.editDelay('Store has been created.', 1000);
    creatingStoreMessage.deleteDelay(2500);
  }
}

async function showAddingItemsError(message, prefix) {
  message.channel.embed({
    type: 'error',
    title: 'Error',
    description:
      'Missing required params or params are incorrect.\n\n' +
      `To check how does this command work please type \`${prefix}add-item help\``,
  });
}

async function addItemToDatabase(message, store, itemPrice, itemName) {
  const randomItemID = Math.floor((Math.random() * Date.now()) / 50);
  const allItems = await store.findOne({ guildID: message.guild.id });
  const doesItemExist = await allItems.items.some((item) => item.name === itemName);

  if (doesItemExist) {
    message.channel.embed({
      type: 'error',
      title: 'Error',
      description: `**${itemName}** already exist.`,
    });
  } else {
    await store.updateOne(
      { guildID: message.guild.id },
      { $push: { items: { id: randomItemID, name: itemName, price: itemPrice } } }
    );

    message.channel.embed({
      type: 'success',
      title: 'New item added',
      description: `**${itemName}** has been added to store for **${itemPrice}$**.`,
      footer: { text: `New item ID: ${randomItemID}` },
    });
  }
}
