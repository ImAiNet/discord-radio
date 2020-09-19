const Discord = require("discord.js")
const radio = require("../radio.json")

module.exports.run = async (client, msg, config, msgArray, cache) => {
  var list = ""
  for (i in radio) {
    var num = +i + 1
    list += num + ". " + radio[i].name + "\n"
  }

  if (msgArray[1]) {
    if (!radio[Number(msgArray[1] - 1)]) return msg.channel.send(new Discord.MessageEmbed().setDescription(`• ${msg.author}, The given station is not on the list!`).setTitle(`Command: ${config.prefix}radio`, client.user.displayAvatarURL()).setColor(0x03E803))
    if (!msg.member.voice.channel) return msg.channel.send(new Discord.MessageEmbed().setDescription(`• ${msg.author}, First you need to join the Voice Channel!`).setTitle(`Command: ${config.prefix}radio`, client.user.displayAvatarURL()).setColor(0x03E803))
    msg.member.voice.channel.join().then(connection => {
      cache[msg.guild.id].connection = connection
      connection.play(radio[Number(msgArray[1] - 1)].link)
      msg.channel.send(new Discord.MessageEmbed().setDescription(`• ${msg.author}, I was able to connect to the channel! \n • **Currently playing:** ${radio[Number(msgArray[1] - 1)].name} \n • To turn off the radio, type: ${config.prefix}leave`).setColor(0x03E803))
      return
    }).catch(console.log)
  } else {
    msg.channel.send(new Discord.MessageEmbed()
    .setAuthor("Radio", client.user.displayAvatarURL())
    .setDescription("Please select the stations: \n" + "```" + list.slice("\n") + "```")
    .setColor(0x03E803)
    .setFooter(msg.author.username, msg.author.displayAvatarURL())
    .setTimestamp()).then(() => {
    const filter = m => msg.author.id === m.author.id

    msg.channel.awaitMessages(filter, {
        time: 10000,
        max: 1,
        errors: ['time']
      })
      .then(messages => {
        if (!radio[Number(messages.first().content - 1)]) return msg.channel.send(new Discord.MessageEmbed().setDescription(`• ${msg.author}, The given station is not on the list!`).setTitle(`Command: ${config.prefix}radio`, client.user.displayAvatarURL()).setColor(0x03E803))
        if (!msg.member.voice.channel) return msg.channel.send(new Discord.MessageEmbed().setDescription(`• ${msg.author}, First you need to join the Voice Channel!`).setTitle(`Command: ${config.prefix}radio`, client.user.displayAvatarURL()).setColor(0x03E803))
          msg.member.voice.channel.join().then(connection => {
            cache[msg.guild.id].connection = connection
            connection.play(radio[Number(messages.first().content-1)].link)
            msg.channel.send(new Discord.MessageEmbed().setDescription(`• ${msg.author}, I was able to connect to the channel! \n • **Currently playing:** ${radio[Number(messages.first().content-1)].name} \n • To turn off the radio, type: ${config.prefix}leave`).setColor(0x03E803))
            return
        }).catch(console.log);
      })
      .catch(() => {
        msg.channel.send(new Discord.MessageEmbed().setDescription(`• ${msg.author}, You haven't given any station!`).setTitle(`Command: ${config.prefix}radio`, client.user.displayAvatarURL()).setColor(0x03E803))
      })
  })
  }
}

module.exports.help = {
  name: "radio",
  disabled: false
}