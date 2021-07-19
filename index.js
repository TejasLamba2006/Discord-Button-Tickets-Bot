const Discord = require("discord.js");
const client = new Discord.Client();
require('discord-reply');
const Dataa = require('st.db');
const db = new Dataa(`/Datas/tickets.json`);
const countsdb = new Dataa(`/Datas/tickets-counts.json`);
const ticketschannelsdb = new Dataa(`/Datas/tickets-channels.json`);
const randomstring = require("randomstring");
const app = require('express')();
app.get('/', (req, res) => res.send(`All Copy Right Reserved For: Visa2Code`));
app.listen(3000)
const disbut = require('discord-buttons');
require('discord-buttons')(client);
const config = require(`./config.json`)
const prefix = config.prefix



async function channelLog(embed) {
  if (!config.log_channel_id) return;
  let ch = await client.channels.cache.get(config.log_channel_id)
  if (!ch) return console.log(`Pls fill config.json`)
  ch.send(embed)
}

client.on('ready', async () => {
  channelLog(`> The **Bot** is connecting to discord API`)
  console.log(`Made by Tejas Lamba$1924`)
  console.log(`Credits | Visa2Code | https://discord.gg/xtessK2DPA`)
  console.log(`Join above or you gay`)

  client.on('message', async (message) => {
    let tickets = db.all()
    tickets.forEach(async body => {
      let channel = await client.channels.cache.get(body.data.channelID)
      if (!channel) return;
      let msg = await channel.messages.fetch(body.data.msgID)
      if (!msg) return;
      let new_id = randomstring.generate({ length: 20 })
      let button = new disbut.MessageButton()
        .setStyle(`gray`)
        .setEmoji(`📩`)
        .setLabel(`Create ticket`)
        .setID(body.data.id)
      let embed = new Discord.MessageEmbed()
        .setTitle(body.data.reason)
        .setDescription("Click Button to Create Ticket 📩")
        .setThumbnail(message.guild.iconURL())
        .setTimestamp()
        .setColor(0x5865F2)
        .setFooter(message.guild.name, message.guild.iconURL())
      try {
        msg.edit({ embed: embed, component: button })
      } catch{

      }
    })
  })
})



client.on('message', async (message) => {
  if (message.author.bot) return;
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
> \`${prefix}rename\` - Rename a specific ticket`)
      .setTimestamp()
      .setColor(0x5865F2)
      .setFooter(`All rights belong to https://discord.gg/xtessK2DPA`)
    message.lineReply({ embed: embed })
  }
  if (command == prefix + `add`) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let args = message.content.split(' ').slice(1).join(' ');
    let channel = message.mentions.channels.first() || message.channel;
    if (await ticketschannelsdb.has(`ticket_${channel.id}`) == true) {
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
    if (await ticketschannelsdb.has(`ticket_${channel.id}`) == true) {
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
    if (await ticketschannelsdb.has(`ticket_${channel.id}`) == true) {
      message.lineReply({ embed: { description: `Your order is executed after 5 seconds, and it will be closed`, color: 0x5865F2 } })
      setTimeout(async () => {
        let log_embed = new Discord.MessageEmbed()
            .setTitle(`Ticket Deleted`)
            .addField(`Ticket number`, `${await ticketschannelsdb.get(`ticket_${channel.id}`).count}`)
            .addField(`Ticket by`,`<@!${await ticketschannelsdb.get(`ticket_${channel.id}`).ticket_by}>`)
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
    if (await ticketschannelsdb.has(`ticket_${channel.id}`) == true) {
      let msg = await message.lineReply({ embed: { description: `Your order is executed after 5 seconds, and it will be closed`, color: 0x5865F2 } })
      setTimeout(async () => {
        try {
          msg.delete()
          channel.send({ embed: { description: `Ticket has been closed by <@!${message.author.id}>`, color: `YELLOW` } })
          let type = 'member'
          await Promise.all(channel.permissionOverwrites.filter(o => o.type === type).map(o => o.delete()));
          channel.setName(`closed-${await ticketschannelsdb.get(`ticket_${channel.id}`).count}`)
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
    if (await ticketschannelsdb.has(`ticket_${channel.id}`) == true) {
      let msg = await message.lineReply({ embed: { description: `Your order is executed after 5 seconds`, color: 0x5865F2 } })
      setTimeout(async () => {
        try {
          msg.delete()
          channel.send({ embed: { description: `Ticket opened by <@!${message.author.id}>`, color: `GREEN` } })
          let meember = client.users.cache.get(await ticketschannelsdb.get(`ticket_${channel.id}`).ticket_by);
          channel.updateOverwrite(meember, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.updateOverwrite(config.support_1, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.updateOverwrite(config.support_2, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.setName(`ticket-${await ticketschannelsdb.get(`ticket_${channel.id}`).count}`)
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
    if (await ticketschannelsdb.has(`ticket_${channel.id}`) == true) {
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
  if (command == prefix + 'send' || command == prefix + 'ticket') {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: This command requires \`ADMINISTRATOR\` permission.`);
    let idd = randomstring.generate({ length: 20 })
    let args = message.content.split(' ').slice(1).join(' ');
    if (!args) args = `Tickets`
    let button = new disbut.MessageButton()
      .setStyle(`gray`)
      .setEmoji(`📩`)
      .setLabel(`Create ticket`)
      .setID(idd)
    let embed = new Discord.MessageEmbed()
      .setTitle(args)
      .setDescription("To create an interaction ticket with📩")
      .setThumbnail(message.guild.iconURL())
      .setTimestamp()
      .setColor(0x5865F2)
      .setFooter(message.guild.name, message.guild.iconURL())
    let msg = await message.channel.send({ embed: embed, component: button }).then(async msg => {
      msg.pin()
      let log_embed = new Discord.MessageEmbed()
        .setTitle(`A message has been sent to open new tickets`)
        .addField(`Channel`, `<#${message.channel.id}>`)
        .addField(`by`, `<@!` + message.author.id + `>`)
        .setTimestamp()
        .setColor(0x5865F2)
        .setFooter(message.guild.name, message.guild.iconURL())
      channelLog(log_embed)
      await db.set(`tickets_${idd}`, {
        reason: args,
        msgID: msg.id,
        id: idd,
        guildName: message.guild.name,
        guildAvatar: message.guild.iconURL(),
        channelID: message.channel.id
      })
    })
  }
})


client.on('clickButton', async (button) => {
  if (db.has(`tickets_${button.id}`) == true) {
    await button.reply.send(`Your ticket is being processed. Please wait `, true)
    await countsdb.math(`counts_${button.message.id}`, `+`, 1)
    let count = await countsdb.get(`counts_${button.message.id}`)
    let channel;
    button.guild.channels.create(`ticket-${count}`, {
      permissionOverwrites: [
        {
          id: button.guild.roles.everyone,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: config.support_1,
          allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
        },
        {
          id: config.support_2,
          allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
        },
        {
          id: button.clicker.user.id,
          allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`],
        },
      ], parent: config.category_id, position: 1, topic: `A Ticket : <@!${button.clicker.user.id}>`, reason: "All rights reserved to Visa2Code"
    }).then(async channel => {
      channel = channel
      await ticketschannelsdb.set(`ticket_${channel.id}`, { count: count, ticket_by: button.clicker.user.id })

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
      client.on('clickButton', async (button1) => {
        if (button1.id == idd) {
          let bu0tton = new disbut.MessageButton()
            .setStyle(`red`)
            .setLabel(`close`)
            .setID(idd + `sure`)
          await button1.reply.send(`Are you sure you want to close this ticket?`, { component: bu0tton, ephemeral: true });
        }
        client.on('clickButton', async (button) => {
          if (button.id == idd + `sure`) {
            await button1.reply.edit(`Your order is executed after 5 seconds, and it will be closed`, true)
            let ch = channel
            if (!ch) return;
            setTimeout(async () => {
              try {
                await ch.send({ embed: { description: `The ticket has already been closed<@!${button.clicker.user.id}>`, color: `YELLOW` } });
                let type = 'member'
                await Promise.all(ch.permissionOverwrites.filter(o => o.type === type).map(o => o.delete()));
                ch.setName(`closed-${await ticketschannelsdb.get(`ticket_${ch.id}`).count}`)
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
      })
    })
  }
})

client.on("ready", async () => {
  await client.user.setActivity(config.status || `Bot Created by Tejas Lamba`)
  console.clear()
  console.log(`-------Tejas Lamba#1924-------`);
})


client.login(process.env.TOKEN)
