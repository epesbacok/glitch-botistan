
const { MessageButton } = require("discord-buttons");
const Discord = require("discord.js")
const ayarlar = require('../ayarlar.json')
const db = require('quick.db')
const moment = require('moment')
require('moment-duration-format')
moment.locale('tr')
exports.run = async (client, message, args) => {
if (message.channel.id !== ayarlar.BOTEkletmeKanalı) return message.channel.send('Bu Komut Sadece <#'+ayarlar.BOTEkletmeKanalı+'> Kanalında Kullanılabilir!').then(Message => Message.delete({timeout: 7500}))
const ClientID = args[0]
if (!ClientID || isNaN(ClientID) || ClientID == client.user.id) return message.channel.send(':x: **| Lütfen BOT ID Yazınız , Please Enter Bot ID**').then(Message => Message.delete({timeout: 7500}))
const Prefix = args[1]
if (!Prefix) return message.channel.send(':x: **| Lütfen Prefix Yazınız , Please Enter Prefix**').then(Message => Message.delete({timeout: 7500}))
const DBL = args[2]
if (!DBL) return message.channel.send(':x: **| Lütfen DBL Durumunu Yazınız , Please Enter DBL Status**').then(Message => Message.delete({timeout: 7500}))
if (ClientID.length < 18) return message.channel.send(':x: **| Girdiğiniz ID Hiçbir Hesap İle Eşleşmedi (Eksik Yazmış Olabilirsiniz.). , The ID you entered did not match any account (You may have typed it missing.).**').then(Message => Message.delete({timeout: 7500}))
if (db.fetch(`Durum_${ClientID}`) == true) return message.channel.send('**Botunuzun Hali Hazırda Mevcut Bir Başvurusu Bulunuyor. Lütfen Bekleyin ya da Bir Yetkili İle İletişime Geçin.**').then(Message => Message.delete({timeout: 7500}))
if (message.guild.members.cache.filter(Users => Users.user.bot).find(Botlar => Botlar.id === ClientID) && db.has(`Sahip_${ClientID}`) && db.has(`Eklenme_${ClientID}`)) return message.channel.send('**Bu BOT Zaten Ekli!** (Tarafından: `'+client.users.cache.get(db.fetch(`Sahip_${ClientID}`)).tag+' | '+db.fetch(`Eklenme_${ClientID}`)+'`)').then(Message => Message.delete({timeout: 7500}))
const BOTModeratör = ayarlar.BOTModRol
db.set(`Durum_${ClientID}`,true)
client.users.fetch(ClientID).then((User) => {
if (!User.bot) return message.channel.send('**Girdiğiniz ID Bir Bota Ait Değil.**').then(Message => Message.delete({timeout: 7500}))
const nova = new Discord.MessageEmbed()
.setColor('RANDOM')
.setAuthor(message.author.tag,message.author.avatarURL({dynamic:true}))
.setDescription(`
Bot İsteği Geldi!

Uygulama ID: **\`${ClientID}\`**
Uygulama Adı: **\`${User.tag}\`**
Uygulama Ön Eki: **\`${Prefix}\`**
Uygulama Sahibi: **\`${message.author.tag}\`** (${message.author})
Uygulama Onay Durumu: **[${DBL}](https://top.gg/bot/${ClientID})**`)
.setTimestamp()
.setFooter(User.tag,User.avatarURL())

   const button3 = new MessageButton()
       .setStyle("url")
       .setLabel("Bot Ekle")
       .setEmoji("<:bc_bot:934478286216642620>")
       .setURL(`https://discord.com/oauth2/authorize?scope=bot&permissions=0&client_id=${ClientID}&guild_id=${message.guild.id}`)
       

        
    



client.channels.cache.get(ayarlar.BOTLog).send(
new Discord.MessageEmbed()
.setTitle("Bot Ekletildi!")
.setDescription(`**${message.author} Adlı Kullanıcı \`${User.tag}\` Adlı Botunun Sisteme Onaylanması İçin Başvurdu!**`)
.setColor("RANDOM")
)
client.channels.cache.get(ayarlar.BOTModKanal).send({buttons:[button3],embed: nova}).then(Mesaj => {
db.set(`Mesaj_${ClientID}`,Mesaj.id)
db.set(`Bilgi_${Mesaj.id}`,{Client: ClientID , Gönderen: message.author.id})
})
message.author.send(
new Discord.MessageEmbed()
.setTitle("Bot Bekleme Süreci")
.setDescription("Botun Başarıyla Sisteme Eklendi!")
.setColor("RANDOM")
)
db.set(`BOT_${message.author.id}`,ClientID)
db.set(`Ekledi_${ClientID}`,message.author.id)
db.set(`Sahip_${ClientID}`,message.author.id)
db.set(`Eklenme_${ClientID}`,moment().add(3,'hours').format('LLL'))
})
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['bot-ekle','botekle','addbot','add-bot','add'],
	permLevel: 0
}

exports.help = {
	name: 'bot-ekle',
	description: 'BOT Ekler',
	usage: 'botekle'
}