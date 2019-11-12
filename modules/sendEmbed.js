const Discord = require("discord.js");

module.exports = (client) => {

    client.sendEmbed = async (client, params, channel, msg ) => {

        let Embed = new Discord.RichEmbed()
        
        if(params.author) Embed.setAuthor(params.author[0], (params.author[1] ? params.author[1] : null))
        if(params.title) Embed.setTitle(params.title)
        if(params.color) Embed.setColor(params.color)
        if(params.thumbnail) Embed.setThumbnail(params.thumbnail)
        if(params.desc) Embed.setDescription(params.desc)
        if(params.fields) params.fields.forEach(field => Embed.addField(field[0], field[1], (field[2] ? field[2] : null )))
        if(params.footer) Embed.setFooter(params.footer[0], (params.footer[1] ? params.footer[1] : null))
        if(params.url) Embed.setURL(params.url)

        const embedMsg = channel.send((msg ? msg : ""), {embed: Embed})

        return embedMsg

    }

    client.editEmbed = async (params) => {

        let Embed = new Discord.RichEmbed()
        
        if(params.author) Embed.setAuthor(params.author[0], (params.author[1] ? params.author[1] : null))
        if(params.title) Embed.setTitle(params.title)
        if(params.color) Embed.setColor(params.color)
        if(params.thumbnail) Embed.setThumbnail(params.thumbnail)
        if(params.desc) Embed.setDescription(params.desc)
        if(params.fields) params.fields.forEach(field => Embed.addField(field[0], field[1], (field[2] ? field[2] : null )))
        if(params.footer) Embed.setFooter(params.footer[0], (params.footer[1] ? params.footer[1] : null))
        if(params.url) Embed.setURL(params.url)

        return Embed

    }



}
