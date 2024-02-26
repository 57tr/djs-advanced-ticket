const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder
} = require("discord.js");

const configSchema = require("../../schemas/configSchema");
const setupSchema = require("../../schemas/setupSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Config the ticket system.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(channel =>
            channel
                .setName("transcription_channel")
                .setDescription("Channel to send the transcript of closed tickets.")
                .addChannelTypes(0)
                .setRequired(true)
        )
        .addChannelOption(channel =>
            channel
                .setName("logging_channel")
                .setDescription("Channel to send the log of the tickets.")
                .addChannelTypes(0)
                .setRequired(true)
        )
        .addRoleOption(role =>
            role
                .setName("support_role")
                .setDescription("Select the role that will support the tickets.")
                .setRequired(true)
        ),

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {

        const { options, guild } = interaction;

        const setupData = await setupSchema.findOne({ guildId: guild.id });

        if (!setupData) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "Error", iconURL: "https://i.imgur.com/UhD2EUb.png" })
                    .setDescription("You have not created a ticket system yet!")
                    .addFields(
                        { name: "To create one run:", value: "`/setup <channel> <category>`." }
                    )
                    .setColor("Red"),
            ],
            ephemeral: true
        });

        const channelTranscript = options.getChannel("transcription_channel");
        const channelLog = options.getChannel("logging_channel");
        const supportRole = options.getRole("support_role");

        configSchema.findOne({ guildId: guild.id }).then((data) => {
            if (data) {
                data.channelTranscript = channelTranscript.id;
                data.channelLog = channelLog.id;
                data.supportRoleId = supportRole.id;

                data.save().catch((error) => {
                    console.log(error);
                });
            } else {
                new configSchema({
                    guildId: guild.id,
                    channelTranscript: channelTranscript.id,
                    channelLog: channelLog.id,
                    supportRoleId: supportRole.id
                }).save().catch((error) => {
                    console.log(error);
                });
            }
        }).catch((err) => {
            throw err;
        });

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Ticket System Config")
                    .setDescription("Ticket config complete!")
                    .addFields(
                        { name: "Channel transcript:", value: `${channelTranscript}`, inline: true },
                        { name: "Channel log:", value: `${channelLog}`, inline: true },
                        { name: "Support role:", value: `${supportRole}`, inline: false }
                    )
                    .setColor("Green"),
            ],
            ephemeral: true
        });
    }
};