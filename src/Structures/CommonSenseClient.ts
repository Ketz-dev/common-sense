import { ActivityType, Client, GatewayIntentBits, Partials } from "discord.js"
import { connect } from 'mongoose'
import Logger from '../Util/Logger'
import ClientEventHandler from './ClientEventHandler'
import SlashCommandHandler from './SlashCommandHandler'

export default class extends Client<true> {
    public readonly eventHandler = new ClientEventHandler(this)
    public readonly commandHandler = new SlashCommandHandler()

    public constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildBans,
                GatewayIntentBits.MessageContent,
            ],
            allowedMentions: { repliedUser: false },
            partials: [Partials.Message],
            presence: { 
                activities: [{
                    name: 'Weezer', type: ActivityType.Listening,
                    url: 'https://open.spotify.com/track/7GptbanebPZYkLPvjNfd6m?si=29ca9eede0364af0'
                }]
            }
        })
    }

    public async start(): Promise<void> {
        await this.eventHandler.registerEvents('events/client')
        await this.commandHandler.registerCommands('commands')

        try {
            await connect(process.env.MONGO_URI!)

            Logger.info('Successfully connected to the database!')

            await this.login(process.env.BOT_TOKEN!)
        } catch (error) {
            Logger.error('Unable to connect to database:', error)
        }
    }
}