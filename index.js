const fs = require("fs");

const {Client, Collection, GatewayIntentBits} = require("discord.js");

// Deploy commands to Discord API
require("./deployCommands");

const client = new Client({
  intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers],
});

// Load commands
client.commands = new Collection();
// eslint-disable-next-line semi
if (fs.existsSync("./src/commands")) {
  const commandFiles = fs.readdirSync("./src/commands")
      .filter((file) => file.endsWith(".js"));


  for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    client.commands.set(command.data.name, command);
    console.log(`Command ${command.data.name} loaded.`);
  }
}

// Load events
if (fs.existsSync("./src/events")) {
  const eventFiles = fs.readdirSync("./src/events")
      .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`./src/events/${file}`);
    try {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    } catch (error) {
      console.error(error);
    }
    console.log(`Event ${event.name} loaded.`);
  }
}

// Load tasks
if (fs.existsSync("./src/tasks")) {
  const taskFiles = fs.readdirSync("./src/tasks")
      .filter((file) => file.endsWith(".js"));
  for (const file of taskFiles) {
    const task = require(`./src/tasks/${file}`);
    try {
      task.run(client);
      console.log(`Task ${task.name} started.`);
    } catch (error) {
      console.error(`Error while starting ${task.name}.\n${error}`);
    }
  }
}

// Handle interactions
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    const reply = {
      content: "There was an error while executing this command!",
      ephemeral: true,
    };
    if (interaction.replied) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});


client.login(process.env.DISCORD_TOKEN);
