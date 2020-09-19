const config = require("./config.json")
const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client()
client.commands = new Discord.Collection()
var cache = {}, loading = []

fs.readdir("./commands/", (err, files) => {
  if (err) console.log(err)
  files.forEach(file => {
    if(!file.endsWith('.js')) return
    const cmd = require(`./commands/${file}`)
    var status = "Loaded"
    if(cmd.help.disabled) status = "Disabled"
    loading.push({ name: cmd.help.name, type: "Command", status: status})
    client.commands.set(cmd.help.name, cmd)
  })
})

client.on("message", (msg) => {
  if(msg.author.bot) return
  if(msg.channel.type == "dm") return
  if(!msg.content.startsWith(config.prefix)) return
  if (!cache[msg.guild.id]) {
    cache[msg.guild.id] = {}
    cache[msg.guild.id].connection = null
    cache[msg.guild.id].dispather = null
    cache[msg.guild.id].playing = false
    cache[msg.guild.id].paused = false
  }
  
  let msgArray = msg.content.slice(config.prefix.length).split(" ")
  let commandfile = client.commands.get(msgArray[0])
  if (commandfile && !commandfile.help.disabled) {
    commandfile.run(client, msg, config, msgArray, cache)
  }else{
    msg.channel.send(new Discord.MessageEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setDescription("Sorry, this command doesn't exist. Check the list of available commands under \` " + config.prefix + "help`\ ")
    .setColor(0x03E803)
    .setFooter(msg.author.username, msg.author.displayAvatarURL())
    .setTimestamp())
  }
})

client.on("ready", () => {
  client.user.setActivity(config.prefix + "help", {type: "GAME"})
  console.log(`${client.user.username} is online on ${client.guilds.cache.size} servers!`)  
})

client.login(config.token).then(()=>{
  console.table(loading)
})