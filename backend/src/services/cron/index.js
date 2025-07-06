const cron = require("node-cron");
const syncBlockedUsers = require("./handlers/syncBlockedUsers");

const readyTasks = [];
const localDateformatter = new Intl.DateTimeFormat("ka-GE", {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	hour12: false,
	timeZone: "Asia/Tbilisi"
});

const taskHandlers = {
	syncBlockedUsersTask: {
		handler: syncBlockedUsers,
		periodPattern: "*/5 * * * *"
	}
};

for (const taskName in taskHandlers) {
	const { handler, periodPattern } = taskHandlers[taskName];
	const task = cron.schedule(
		periodPattern,
		async (context) => await handler(context),
		{
			scheduled: false,
			context: () => ({
				dateLocalIso: localDateformatter.format(new Date())
			})
		}
	);

	task.on("execution:failed", (ctx) => {
		console.error(
			`❌ Error on "${taskName}" cron task execution:`,
			ctx.execution?.error?.message
		);
	});

	task.on("execution:finished", () => {
		console.log(`✅ Successfully finished "${taskName}" cron task execution`);
	});

	readyTasks.push(task);
}

module.exports = readyTasks;
