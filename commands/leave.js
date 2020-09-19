const Discord = require("discord.js")

module.exports.run = async (client, msg, config, msgArray, cache) => {
  if (!msg.member.voice.channel) return msg.channel.send(new Discord.MessageEmbed().setDescription(`• ${msg.author}, You must be in the voice channel!`).setTitle(`Command: ${config.prefix}leave`, client.user.displayAvatarURL()).setColor(0x03E803))
  if (!cache[msg.guild.id].connection) return msg.channel.send(new Discord.MessageEmbed().setDescription(`• ${msg.author}, The bot is not on the voice channel!`).setTitle(`Command: ${config.prefix}leave`, client.user.displayAvatarURL()).setColor(0x03E803))
  cache[msg.guild.id].connection.disconnect()
  cache[msg.guild.id].connection = null
  return msg.channel.send(new Discord.MessageEmbed().setDescription(`• ${msg.author}, Successfully disconnected from the channel!`).setTitle(`Command: ${config.prefix}leave`, client.user.displayAvatarURL()).setColor(0x03E803))
}

module.exports.help = {
  name: "leave",
  disabled: false
}