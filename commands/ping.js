export default {
  run({ message }) {
    message.channel.embed({
      description: `Ping, Pong! Current delay: \`${Date.now() - message.createdTimestamp}ms\`.`,
    });
  },
};
