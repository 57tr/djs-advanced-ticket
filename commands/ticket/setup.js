const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const setupSchema = require('../../schemas/setupSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Set up the ticket system.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(channel =>
            channel
                .setName('channel')
                .setDescription('Channel where the bot will send the ticket message.')
                .addChannelTypes(0)
                .setRequired(true)
        )
        .addChannelOption(category =>
            category
                .setName('category')
                .setDescription('Category where the tickets will be created.')
                .addChannelTypes(4)
                .setRequired(true)
        )
        .addStringOption(description =>
            description
                .setName('description')
                .setDescription('The description of the embed in the ticket system panel.')
        ),
    /**
     * ! Check the order of how you pass parameters in your slashcommand handler
     */

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {

        const { options, guild } = interaction;

        const defaultDescription = 'Click the `Create Ticket` button below to create a ticket and our support team will get back to you. Please be patient.'

        const channel = options.getChannel('channel');
        const category = options.getChannel('category');
        const embedDescription = options.getString('description') || defaultDescription;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('ticket-button')
                .setEmoji('🎟')
                .setLabel('Create Ticket')
                .setStyle(ButtonStyle.Danger)
        );

        setupSchema.findOne({ guildId: guild.id }).then(async (data) => {
            if (data) {
                let msgDelete;
                const ch = guild.channels.cache.get(data.channelId);
                if (ch) msgDelete = await ch.messages.fetch(data.messageId).catch(() => { });
                if (msgDelete) await msgDelete.delete().catch(() => { });

                data.channelId = channel.id;
                data.categoryId = category.id;
                data.embedDescription = embedDescription;

                const dataFinish = await data.save();

                await channel.send({
                    embeds: [returnEmbedPanel(guild, dataFinish.embedDescription)],
                    components: [row]
                }).then(async (msg) => {
                    dataFinish.messageId = msg.id;
                    await dataFinish.save();

                    return interaction.reply({
                        embeds: [returnEmbedReply(dataFinish.channelId, dataFinish.categoryId)],
                        ephemeral: true,
                    });
                });

            } else {
                const dataFinish = await new setupSchema({
                    guildId: guild.id,
                    channelId: channel.id,
                    categoryId: category.id,
                    embedDescription: embedDescription
                }).save();

                await channel.send({
                    embeds: [returnEmbedPanel(guild, dataFinish.embedDescription)],
                    components: [row]
                }).then(async (msg) => {
                    dataFinish.messageId = msg.id;
                    await dataFinish.save();

                    return interaction.reply({
                        embeds: [returnEmbedReply(dataFinish.channelId, dataFinish.categoryId)],
                        ephemeral: true,
                    });
                });
            }
        }).catch((err) => {
            throw err;
        });
    },
};

function returnEmbedReply(channel, category) {
    return new EmbedBuilder()
        .setAuthor({ name: `Ticket setup completed successfully`, iconURL: 'https://i.imgur.com/6gvcooF.gif' })
        .setDescription('> Correctly set up the ticket system.')
        .addFields(
            { name: 'Channel:', value: `<#${channel}>` },
            { name: 'Category:', value: `<#${category}>` }
        )
        .setColor('Green')
}

function returnEmbedPanel(guild, description) {
    return new EmbedBuilder()
        .setAuthor({ name: `${guild.name}'s - Ticket Panel`, iconURL: 'https://i.imgur.com/xS1riaP.png' })
        .setDescription(description)
        .setColor('Red')
        .setFooter({ text: 'Coded by @juan.cc02' });
}