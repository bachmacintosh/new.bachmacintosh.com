// @type Intl.DateTimeFormatOptions

const dateOptions = {
	dateStyle: "long",
	timeStyle: "short",
	hour12: true,
	timeZone: "America/New_York",
};

/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	env: {
		baseUrl: "https://bachmacintosh.com",
		version: process.env.npm_package_version ?? "?.?.?",
		commit: process.env.CF_PAGES_COMMIT_SHA ?? "????????",
		buildTime: new Date().toLocaleString("en-US", dateOptions),
	},
	experimental: {
		appDir: true,
	},
};

export default nextConfig;
