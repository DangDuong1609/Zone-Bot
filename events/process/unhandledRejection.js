const { useClient, useLogger } = require("@zibot/zihooks");
const client = useClient();
const logger = useLogger();

module.exports = {
	name: "unhandledRejection",
	type: "process",
	execute: async (error) => {
		logger.error("Unhandled promise rejection:", error);

		if (client && typeof client.errorLog === "function") {
			client.errorLog(`Unhandled promise rejection: **${error.message}**`);
			client.errorLog(error.stack);
		} else {
			logger.error("Error logging function is not available on client.");
		}
	},
};
