import { Client, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import './database';
dotenv.config();

const client = new Client();
client.commands = new Collection();

const commands = readdirSync('./commands/');
const events = readdirSync('./events/');

commands.forEach((file) => {
  import(`./commands/${file}`).then((command) => {
    client.commands.set(file.split('.')[0], command);
  });
});

events.forEach(async (event) => {
  const ev = await import(`./events/${event}`);
  ev.run(client);
});

client.login(process.env.BOT_TOKEN);
