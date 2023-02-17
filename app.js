require('dotenv').config()
const { Telegraf } = require('telegraf')
const axios = require('axios')

const isUrl = (url) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
} 

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply('Enter the url!'))

bot.on('text', async (ctx) => {
    // console.log(ctx.message.text, isUrl(ctx.message.text))
    if (isUrl(ctx.message.text)) {
        const res = await axios.get(`https://api.shrtco.de/v2/shorten?url=${ctx.message.text}`)
        const data = res.data
        // console.log(res)
        if (!data.ok) return ctx.reply('Invalid url!')
        const reply = `Short url: ${data.result.short_link}\nFull url: ${data.result.full_short_link}`
        ctx.reply(reply)
    } else {
        ctx.reply('Invalid url!')
    }
})

// console.log("bor: ", bot)

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));