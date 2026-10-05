module.exports = {
    user: ["1130139643141177445"],
    name: "eval",
    description: "Evaluates JavaScript code",
    cooldown: 0,
    async execute(message, client, args) {
        // Check if there is code to evaluate
        if (!args.length) {
            return message.reply({ content: "Please provide code to evaluate.", ephemeral: true });
        }

        // Combine args into one string
        const code = args.join(" ");

        try {
            // Evaluate the code and capture the result
            let evalResult = eval(code);

            // If the result is a promise, await it
            if (evalResult instanceof Promise) {
                evalResult = await evalResult;
            }

            // Convert the result to a string and limit its length
            let result = String(evalResult);
            if (result.length > 2000) {
                result = result.slice(0, 1997) + "...";
            }

            // Send the result back to the channel
            await message.channel.send(`\`\`\`js\n${result}\n\`\`\``);
        } catch (error) {
            // Handle any errors and send them back
            await message.channel.send(`\`Error\`: \`\`\`js\n${error.message}\n\`\`\``);
        }
    }
};