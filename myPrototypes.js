import { TextChannel, Message } from 'discord.js';

TextChannel.prototype.embed = function (embedData) {
  const colors = {
    error: '#ff4444',
    success: '#00C851',
    info: '#33b5e5',
    warning: '#ffbb33',
  };

  return this.send({ embed: { ...embedData, color: colors[embedData.type] || colors.info } });
};

Message.prototype.deleteDelay = function (delayInMs) {
  return setTimeout(() => this.delete(), delayInMs);
};

Message.prototype.editDelay = function (newContent, delayInMs) {
  return setTimeout(() => this.edit(newContent), delayInMs);
};
