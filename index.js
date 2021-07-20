const Discord = require("discord.js");
const client = new Discord.Client({
  disableMentions: 'everyone'
})
require("dotenv").config()
require('discord-reply');
const { Database } = require("quickmongo");
const db = new Database(process.env.Mongo)
const randomstring = require("randomstring");
const disbut = require('discord-buttons');
require('discord-buttons')(client);
const { MessageMenu, MessageMenuOption } = require('discord-buttons');
const config = require(`./config.json`)
const prefix = config.prefix
const { toke, guild, chan, pa }    = 	   require("./config.json");

async function channelLog(embed) {
  if (!config.log_channel_id) return;
  let ch = await client.channels.cache.get(config.log_channel_id) || message.guild.channels.cache.find(channel => channel.name.match("log"));
  if (!ch) return console.log(`Pls fill config.json`)
  ch.send(embed)
}

client.on('ready', async () => {
  channelLog(`> The **Bot** is connecting to discord API`)
  console.log(`Made by Tejas Lamba$1924`)
  console.log(`Credits | Visa2Code | https://discord.gg/xtessK2DPA`)
  console.log(`Join above or you gay`)
  client.user.setActivity(config.status.name, { type: config.status.type.toUpperCase(), url: "https://twitch.tv/SmallCadaver" })
});
client.on("message", async(message) =>{
  if (message.author.bot || !message.guild) return;
  if (message.guild.id !== guild) return;
  let command = message.content.toLowerCase().split(" ")[0];
  if (command == prefix + `help`) {
    let embed = new Discord.MessageEmbed()
      .setTitle(`Bot commands list`)
      .setDescription(`> \`${prefix}send\` - Send a message to open tickets
> \`${prefix}add\` - Adds a member to a specific ticket
> \`${prefix}remove\` - Removes a member to a specific ticket.
> \`${prefix}delete\` - Delete a specific ticket
> \`${prefix}close\` - Close a specific ticket
> \`${prefix}open\` - Open a specific ticket
> \`${prefix}rename\` - Rename a specific ticket
> \`${prefix}setchannels\` - set channels relating to ticket log and category
> \`${prefix}setstaff\` - set staff roles`)
      .setTimestamp()
      .setColor(0x5865F2)
      .setFooter(`All rights belong to https://discord.gg/xtessK2DPA`)
    message.lineReply({ embed: embed })
  }
  if (command == prefix + `add`) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let args = message.content.split(' ').slice(1).join(' ');
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = client.db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `this server needs to set up their staff roles first! \`{prefix}setstaff\``, color: 0x5865F2 } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args || message.guild.members.cache.find(x => x.user.username === args || x.user.username === args));
      if (!member) return message.lineReply(`Mention a member of its ID`);
      try {
        channel.updateOverwrite(member.user, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
          ATTACH_FILES: true,
          READ_MESSAGE_HISTORY: true,
        }).then(() => {
          message.lineReply({ embed: { description: `${member} has been successfully added to ${channel}`, color: 0x5865F2 } });
          let log_embed = new Discord.MessageEmbed()
            .setTitle(`A person has been added to a ticket`)
            .addField(`Ticket`, `<#${channel.id}>`)
            .addField(`Added Person`, member.user)
            .addField(`Action by`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`GREEN`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
        });
      }
      catch (e) {
        return message.channel.send(`An error occurred, please try again!`);
      }
    }
  }
  if (command == prefix + `remove`) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let args = message.content.split(' ').slice(1).join(' ');
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = client.db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `this server needs to set up their staff roles first! \`{prefix}setstaff\``, color: 0x5865F2 } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args || message.guild.members.cache.find(x => x.user.username === args || x.user.username === args));
      if (!member) return message.lineReply(`Mention a member of its ID`);
      try {
        channel.updateOverwrite(member.user, {
          VIEW_CHANNEL: false,
        }).then(() => {
           let log_embed = new Discord.MessageEmbed()
            .setTitle(`People removed to ticket`)
            .addField(`Ticket`, `<#${channel.id}>`)
            .addField(`person added`, member.user)
            .addField(`Action by`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`RED`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
          message.lineReply({ embed: { description: `Successfully delete ${member} from ${channel}`, color: 0x5865F2 } });
        });
      }
      catch (e) {
        return message.channel.send(`An error occurred, please try again!`);
      }
    }
  }
  if (command == prefix + 'delete') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = client.db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `this server needs to set up their staff roles first! \`{prefix}setstaff\``, color: 0x5865F2 } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      message.lineReply({ embed: { description: `Your order is executed after 5 seconds, and it will be closed`, color: 0x5865F2 } })
      setTimeout(async () => {
        let log_embed = new Discord.MessageEmbed()
            .setTitle(`Ticket Deleted`)
            .addField(`Ticket number`, `${await db.get(`ticket_${channel.id}_${message.guild.id}`).count}`)
            .addField(`Ticket by`,`<@!${await db.get(`ticket_${channel.id}_${message.guild.id}`).ticket_by}>`)
            .addField(`Action by`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`RED`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
          channel.delete()
      }, 5000)
    }
  }
  if (command == prefix + 'close') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = client.db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `this server needs to set up their staff roles first! \`{prefix}setstaff\``, color: 0x5865F2 } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let msg = await message.lineReply({ embed: { description: `Your order is executed after 5 seconds, and it will be closed`, color: 0x5865F2 } })
      setTimeout(async () => {
        try {
          msg.delete()
          channel.send({ embed: { description: `Ticket has been closed by <@!${message.author.id}>`, color: `YELLOW` } })
          let type = 'member'
          await Promise.all(channel.permissionOverwrites.filter(o => o.type === type).map(o => o.delete()));
          channel.setName(`closed-${await db.get(`ticket_${channel.id}_${message.guild.id}`).count}`)
          let log_embed = new Discord.MessageEmbed()
            .setTitle(`Ticket closed`)
            .addField(`Ticket`, `<#${channel.id}>`)
            .addField(`Action by`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`YELLOW`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
        } catch (e) {
          return message.channel.send(`An error occurred, please try again!`);
        }
      }, 1000)
    }
  }

  if (command == prefix + 'open') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = client.db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `this server needs to set up their staff roles first! \`{prefix}setstaff\``, color: 0x5865F2 } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let msg = await message.lineReply({ embed: { description: `Your order is executed after 5 seconds`, color: 0x5865F2 } })
      setTimeout(async () => {
        try {
          msg.delete()
          channel.send({ embed: { description: `Ticket opened by <@!${message.author.id}>`, color: `GREEN` } })
          let meember = client.users.cache.get(await db.get(`ticket_${channel.id}_${message.guild.id}`).ticket_by);
          channel.updateOverwrite(meember, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.updateOverwrite((await client.db.get(`Staff_${message.guild.id}.Admin`)), {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.updateOverwrite((await client.db.get(`Staff_${message.guild.id}.Moder`)), {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.setName(`ticket-${await db.get(`ticket_${channel.id}_${message.guild.id}`).count}`)
          let log_embed = new Discord.MessageEmbed()
            .setTitle(`Ticket has reopened`)
            .addField(`Ticket`, `<#${channel.id}>`)
            .addField(`Action by`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`GREEN`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
        } catch (e) {
          return message.channel.send(`An error occurred, please try again!`);
        }
      }, 1000)
    }
  }
  if (command == prefix + 'rename' || command == prefix + 'setname') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = client.db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `this server needs to set up their staff roles first! \`{prefix}setstaff\``, color: 0x5865F2 } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let args = message.content.split(' ').slice(1).join(' ');
      if (!args) return message.lineReply({ embed: { description: `Please select the name you want for the ticket`, color: 0x5865F2 } })
      channel.setName(args)
      message.delete()
      let log_embed = new Discord.MessageEmbed()
        .setTitle(`Ticket name change`)
        .addField(`New name`, args)
        .addField(`Ticket`, `<#${channel.id}>`)
        .addField(`by`, `<@!${message.author.id}>`)
        .setTimestamp()
        .setColor(0x5865F2)
        .setFooter(message.guild.name, message.guild.iconURL())
      channelLog(log_embed)
    }
  }
  if (command == prefix + 'setstaff'){
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: This command requires \`ADMINISTRATOR\` permission.`);
    if (args.length < 2) return message.lineReply({ embed: { description: `Please mention an Admin role  (or iD), *then* a Mod role (or iD) with this command! `, color: 0x5865F2 } })
    if (message.mentions.roles.length < 2 && !Number(args[0]) && !Number(args[1])) return message.lineReply({ embed: { description: `Please mention an Admin role (or iD) first, *then* a Mod role (or iD) with this command! `, color: 0x5865F2 } })
    const Admin = message.mentions.roles[0] || message.guild.roles.cache.find(args[0]);
    const Moder = message.mentions.roles[1] || message.guild.roles.cache.find(args[1]);
    await db.set(`Staff_${message.guild.id}.Admin`, Admin.id)
    await db.set(`Staff_${message.guild.id}.Moder`, Moder.id)
    message.delete()
    message.react("✅")
  }
  if (command == prefix + 'setchannels'){
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: This command requires \`ADMINISTRATOR\` permission.`);
    if (args.length < 2) return message.lineReply({ embed: { description: `Please mention an Log Channel (or iD), *then* a Category (or iD) with this command! `, color: 0x5865F2 } })
    if (message.mentions.roles.length < 2 && !Number(args[0]) && !Number(args[1])) return message.lineReply({ embed: { description: `Please mention an Log Channel (or iD), *then* a Category (or iD) with this command! `, color: 0x5865F2 } })
    const txt = message.mentions.channels[0] || message.guild.channels.cache.find(args[0]);
    const cat = message.mentions.channels[1] || message.guild.channels.cache.find(args[1]);
    if (Admin.type !== "text") return message.channel.send("The first input should be a text channel");
    if (Moder.type !== "category") return message.channel.send("The second input should be a text category");
    await db.set(`Channels_${message.guild.id}.Log`, txt.id)
    await db.set(`Channels_${message.guild.id}.Cat`, cat.id)
    message.delete()
    message.react("✅")
  }
  if (command == prefix + 'send' || command == prefix + 'ticket') {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: This command requires \`ADMINISTRATOR\` permission.`);
    const sfats = client.db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `this server needs to set up their staff roles first! \`{prefix}setstaff\``, color: 0x5865F2 } })
    let idd = randomstring.generate({ length: 20 })
    let args = message.content.split(' ').slice(1).join(' ');
    if (!args) args = `Tickets`
    let button1 = new MessageMenuOption()
    .setLabel('Special Support')
    .setEmoji('🔴')
    .setValue("men")
    .setDescription('Use this to contact Admins+ only!')
    let button3 = new MessageMenuOption()
    .setLabel('General Support')
    .setEmoji('🟠')
    .setValue("hlp")
    .setDescription('Use this to contact Helpers and higher ranks!')  
    let select = new MessageMenu()
    .setID(idd)
    .setPlaceholder('Create A ticket!')
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions(button1, button2, button3)
    let embed = new Discord.MessageEmbed()
      .setTitle(args)
      .setDescription("To create a ticket, select one of the options below from the menu.")
      .setThumbnail(message.guild.iconURL())
      .setTimestamp()
      .setColor(0x5865F2)
      .setFooter(message.guild.name, message.guild.iconURL())
    let msg = await message.channel.send({ embed: embed, component: select }).then(async msg => {
      msg.pin()
      let log_embed = new Discord.MessageEmbed()
        .setTitle(`A message has been sent to open new tickets`)
        .addField(`Channel`, `<#${message.channel.id}>`)
        .addField(`by`, `<@!` + message.author.id + `>`)
        .setTimestamp()
        .setColor(0x5865F2)
        .setFooter(message.guild.name, message.guild.iconURL())
      channelLog(log_embed)
      await db.set(`tickets_${idd}_${message.guild.id}`, {
        reason: args,
        msgID: msg.id,
        id: idd,
        options: [button1, button2, button3],
        guildName: message.guild.name,
        guildAvatar: message.guild.iconURL(),
        channelID: message.channel.id
      })
    })
  }
})


client.on('clickMenu', async (button) => {
  console.log(button.values)
  if (db.get(`tickets_${button.id}_${message.guild.id}`)) {
    await button.reply.send(`Your ticket is being processed. Please wait `, true)
    await db.math(`counts_${button.message.id}_${button.message.guild.id}`, `+`, 1)
    let count = await db.get(`counts_${button.message.id}_${button.message.guild.id}`)
    let channel;
    await button.clicker.fetch();
    if (button.values[0] === "men") { // Admins +
      button.guild.channels.create(`ticket-${count}`, {
        permissionOverwrites: [
          {
            id: button.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: (await client.db.get(`Staff_${message.guild.id}.Admin`)),
            allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
          },
          {
            id: button.clicker.user.id,
            allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`],
          },
        ], parent: (await db.get(`category_${message.guild.id}`)), position: 1, topic: `A Ticket : <@!${button.clicker.user.id}>`, reason: "All rights reserved to Visa2Code"
      }).then(async channel => {
        channel = channel
        await db.set(`ticket_${channel.id}_${message.guild.id}`, { count: count, ticket_by: button.clicker.user.id })
      
        await button.reply.edit(`
  **Your ticket has been successfully opened** <#${channel.id}>`, true)
            let log_embed = new Discord.MessageEmbed()
              .setTitle(`New ticket opened`)
              .addField(`Ticket`, `<#${channel.id}>`)
              .addField(`Ticket by`, `<@!${button.clicker.user.id}>`)
              .addField(`Ticket number`, count)
              .setTimestamp()
              .setColor(`GREEN`)
            channelLog(log_embed)
        const embedticket = new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle("Specialised Support")
          .setFooter(`Ticket opened at`)
          .setColor(0x5865F2)
          .setDescription(`Support will be with you soon.\n
  To close this ticket, interact with 🔒`)
        let idd = randomstring.generate({ length: 25 })
        let bu1tton = new disbut.MessageButton()
          .setStyle(`gray`)
          .setEmoji(`🔒`)
          .setLabel(`Close`)
          .setID(idd)
        channel.send(`Welcome <@!${button.clicker.user.id}>`, { embed: embedticket, component: bu1tton }).then(msg => {
          msg.pin()
        })
        })
      }
        if (button.values[0] === "hlp"){ // help +
          button.guild.channels.create(`ticket-${count}`, {
            permissionOverwrites: [
              {
                id: button.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
              },
              {
                id: (await client.db.get(`Staff_${message.guild.id}.Admin`)),
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
              },
              {
                id: (await client.db.get(`Staff_${message.guild.id}.Moder`)),
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
              },
              {
                id: button.clicker.user.id,
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`],
              },
            ], parent: (await db.get(`category_${message.guild.id}`)), position: 1, topic: `A Ticket : <@!${button.clicker.user.id}>`, reason: "All rights reserved to Visa2Code"
          }).then(async channel => {
            channel = channel
            await db.set(`ticket_${channel.id}_${message.guild.id}`, { count: count, ticket_by: button.clicker.user.id })
          
            await button.reply.edit(`
      **Your ticket has been successfully opened** <#${channel.id}>`, true)
                let log_embed = new Discord.MessageEmbed()
                  .setTitle(`New ticket opened`)
                  .addField(`Ticket`, `<#${channel.id}>`)
                  .addField(`Ticket by`, `<@!${button.clicker.user.id}>`)
                  .addField(`Ticket number`, count)
                  .setTimestamp()
                  .setColor(`GREEN`)
                channelLog(log_embed)
            const embedticket = new Discord.MessageEmbed()
              .setTimestamp()
              .setTitle("General Support")
              .setFooter(`Ticket opened at`)
              .setColor(0x5865F2)
              .setDescription(`Support will be with you soon.\n
      To close this ticket, interact with 🔒`)
            let idd = randomstring.generate({ length: 25 })
            let bu1tton = new disbut.MessageButton()
              .setStyle(`gray`)
              .setEmoji(`🔒`)
              .setLabel(`Close`)
              .setID(idd)
            channel.send(`Welcome <@!${button.clicker.user.id}>`, { embed: embedticket, component: bu1tton }).then(msg => {
              msg.pin()
            })
            })
        }
      }
    });
      client.on('clickButton', async (button1) => {
        if (button1.id == idd) {
          let bu0tton = new disbut.MessageButton()
            .setStyle(`red`)
            .setLabel(`close`)
            .setID(idd + `sure`)
          await button1.reply.send(`Are you sure you want to close this ticket?`, { component: bu0tton, ephemeral: true });
        }
      })
        client.on('clickButton', async (button) => {
          if (button.id == idd + `sure`) {
          await button1.reply.edit(`Your order is executed after 5 seconds, and it will be closed`, true)   
            let ch = channel
            if (!ch) return;
            setTimeout(async () => {
              try {
                await ch.send({ embed: { description: `The ticket has already been closed <@!${button.clicker.user.id}>`, color: `YELLOW` } });
                let type = 'member'
                await Promise.all(ch.permissionOverwrites.filter(o => o.type === type).map(o => o.delete()));
                ch.setName(`closed-${await db.get(`ticket_${ch.id}`).count}`)
                let log_embed = new Discord.MessageEmbed()
                  .setTitle(`Ticket closed`)
                  .addField(`Ticket`, `<#${ch.id}>`)
                  .addField(`Action by`, `<@!${button.clicker.user.id}>`)
                  .setTimestamp()
                  .setColor(`YELLOW`)
                channelLog(log_embed)
              } catch (e) {
                return message.channel.send(`An error occurred, please try again!`);
              }
            }, 4000)
          }
        })
client.login(process.env.TOKEN);
