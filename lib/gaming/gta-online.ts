import type { GTAOnlinePageProps } from "@/types/gaming/gta-online";
import { UserRefreshClient } from "google-auth-library";
import { sheets } from "@googleapis/sheets";
import type { sheets_v4 } from "@googleapis/sheets";

export function getGtaOnlineData(): void {
	const googleSheets = getGoogleSheetsClient();
}

function getGoogleSheetsClient(): sheets_v4.Sheets {
	if (
		typeof process.env.GOOGLE_CLIENT_ID === "undefined" ||
		typeof process.env.GOOGLE_CLIENT_SECRET === "undefined" ||
		typeof process.env.GOOGLE_REFRESH_TOKEN === "undefined"
	) {
		throw new Error();
	}
	const refreshTokenOAuth = new UserRefreshClient(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		process.env.GOOGLE_REFRESH_TOKEN,
	);
	return sheets({ version: "v4", auth: refreshTokenOAuth });
}
