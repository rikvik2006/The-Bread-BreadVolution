const ReactionRole =

    module.exports = {
        name: "messageReactionAdd",

        async execute(messageReaction, user) {
            if (user.bot) return

            if (messageReaction.message.partial) await messageReaction.message.fetch();


        }
    }