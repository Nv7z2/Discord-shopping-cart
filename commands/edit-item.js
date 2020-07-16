export default {
  async run({ args, message, store, prefix }) {
    const msg = message.content;
    const typeOfAction = args[1] || undefined;
    const currentItemID = (args[2] && parseInt(args[2])) || undefined;
    let newItemData = undefined;

    if (args[3]) {
      if (typeOfAction === 'price') newItemData = parseInt(args[3]);
      else newItemData = msg.substr(msg.indexOf(args[3]));
    }

    if (message.member.hasPermission('ADMINISTRATOR')) {
      if (!(await store.findOne({ guildID: message.guild.id }))) {
        message.channel.embed({
          type: 'warning',
          description: "You don't even have a store, so you can't edit any item.",
        });
      }

      if (!currentItemID || !['price', 'name'].includes(typeOfAction) || !newItemData) {
        showEditingItemsError(message, prefix);
      } else {
        editItemInDatabase(message, store, currentItemID, newItemData, typeOfAction);
      }
    } else {
      message.channel.embed({
        type: 'warning',
        description: 'Missing permissions.',
      });
    }
  },
};

async function showEditingItemsError(message, prefix) {
  message.channel.embed({
    type: 'error',
    title: 'Error',
    description:
      'Missing required params or params are incorrect.\n\n' +
      `To check how does this command work please type \`${prefix}edit-item help\``,
  });
}

async function editItemInDatabase(message, store, currentItemID, newItemData, typeOfAction) {
  const allItems = await store.findOne({ guildID: message.guild.id });
  const currentItem = await allItems.items.find((item) => item.id === currentItemID);
  const doesItemExist = await allItems.items.some((item) => item.id === currentItemID);

  if (doesItemExist) {
    const dataToChange = `items.$.${typeOfAction === 'price' ? 'price' : 'name'}`;
    await store.updateOne(
      { guildID: message.guild.id, 'items.id': currentItemID },
      { $set: { [dataToChange]: newItemData } }
    );

    const newItem = await fetchNewItemData(store, currentItemID, message.guild.id);

    message.channel.embed({
      type: 'success',
      title: 'Item changed',
      description: `**${currentItem.name}** has been edited.\n\nNew item: **${newItem.name}** for **${newItem.price}$**`,
    });
  } else {
    message.channel.embed({
      type: 'error',
      title: 'Error',
      description: `**${currentItem.name}** does not even exist.`,
    });
  }
}

async function fetchNewItemData(store, itemID, guildID) {
  const allItems = await store.findOne({ guildID: guildID });
  return await allItems.items.find((item) => item.id === itemID);
}
