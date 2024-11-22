// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { initializeDatabase } from "~/api/server/db";

initializeDatabase()

export default createHandler(() => (
	<StartServer
		document={({ assets, children, scripts }) => (
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" href="/favicon.ico" />
					<link rel="stylesheet" href="/global.css"></link>
					{assets}
				</head>
				<body>
					{children}
					{scripts}
				</body>
			</html>
		)}
	/>
));
