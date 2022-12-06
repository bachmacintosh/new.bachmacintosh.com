/* eslint-disable no-await-in-loop -- We depend on the order of execution of promises to paginate through the WaniKani
API */
import * as dotenv from "dotenv";
import type {
	BlogFrontMatter,
	BlogPost,
	WaniKaniAssignmentCache,
	WaniKaniCache,
	WaniKaniLevelProgressionCache,
	WaniKaniResetCache,
	WaniKaniReviewCache,
	WaniKaniReviewStatisticCache,
	WaniKaniStudyMaterialCache,
	WaniKaniSubjectCache,
	WaniKaniSubjectItemCache,
	WaniKaniSummaryCache,
	WaniKaniUserCache,
	WaniKaniVoiceActorCache,
} from "@/types";
import type {
	WKAssignmentCollection,
	WKAssignmentData,
	WKAssignmentParameters,
	WKCollection,
	WKCollectionParameters,
	WKError,
	WKLevelProgressionCollection,
	WKLevelProgressionData,
	WKReport,
	WKResetCollection,
	WKResetData,
	WKResource,
	WKReviewCollection,
	WKReviewData,
	WKReviewParameters,
	WKReviewStatisticCollection,
	WKReviewStatisticData,
	WKReviewStatisticParameters,
	WKStudyMaterialCollection,
	WKStudyMaterialData,
	WKStudyMaterialParameters,
	WKSubjectCollection,
	WKSubjectParameters,
	WKSummary,
	WKUser,
	WKVoiceActorCollection,
	WKVoiceActorData,
} from "@bachmacintosh/wanikani-api-types/dist/v20170710";
import { WK_API_REVISION, stringifyParameters } from "@bachmacintosh/wanikani-api-types/dist/v20170710";

import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import fs from "fs";
import path from "path";
import remarkGfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";

if (typeof process.env.GITHUB_ACTIONS === "undefined" && typeof process.env.VERCEL === "undefined") {
	console.info("Loading environment from .env.local...");
	dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
} else {
	console.info("Loading environment from CI...");
}
console.info("\n");

const TOTAL_STEPS = 2;
const HTTP_NOT_MODIFIED = 304;
const WANIKANI_BASE_URL = "https://api.wanikani.com/v2";
const WANIKANI_CACHE_PATH = path.resolve(process.cwd(), ".wanikani");

let cache: WaniKaniCache = {
	levelProgressions: {
		etag: "",
		data: [],
	},
	resets: {
		etag: "",
		data: [],
	},
	subjects: {
		etags: {
			assignments: "",
			reviews: "",
			reviewStatistics: "",
			studyMaterials: "",
			subjects: "",
		},
		data: [],
	},
	summary: {
		etag: "",
		data: null,
	},
	user: {
		etag: "",
		data: null,
	},
	voiceActors: {
		etag: "",
		data: [],
	},
};

console.info("-------------------------");
console.info(`1/${TOTAL_STEPS} - Check WaniKani Cache`);
console.info("-------------------------");
try {
	const cacheFile = await fs.promises.readFile(WANIKANI_CACHE_PATH, "utf-8");
	cache = JSON.parse(cacheFile) as WaniKaniCache;
	console.info("Found existing cache file. Checking for updates...");
} catch (error) {
	console.info("Cache file not found. Making a fresh one.");
}

console.info("Checking for Level Progression updates...");
const newLevelProgressionCache = await getLevelProgressions();
if (newLevelProgressionCache !== null) {
	cache.levelProgressions = newLevelProgressionCache;
}

console.info("Checking for Reset updates...");
const newResetsCache = await getResets();
if (newResetsCache !== null) {
	cache.resets = newResetsCache;
}

console.info("Checking for Subject updates...");
const newSubjectCache = await getSubjects();
if (newSubjectCache !== null) {
	cache.subjects = newSubjectCache;
}

console.info("Checking for Assignment updates...");
const newAssignmentCache = await getAssignments();
if (newAssignmentCache !== null) {
	cache.subjects.etags.assignments = newAssignmentCache.etag;
	newAssignmentCache.data.forEach((item) => {
		const subjectIndex = cache.subjects.data.findIndex((subject) => {
			return subject.subjectId === item.subject_id;
		});
		if (subjectIndex !== -1) {
			cache.subjects.data[subjectIndex].assignment = item;
		}
	});
}

console.info("Checking for Review updates...");
const newReviewCache = await getReviews();
if (newReviewCache !== null) {
	cache.subjects.etags.reviews = newReviewCache.etag;
	newReviewCache.data.forEach((item) => {
		const subjectIndex = cache.subjects.data.findIndex((subject) => {
			return subject.subjectId === item.subject_id;
		});
		if (subjectIndex !== -1) {
			cache.subjects.data[subjectIndex].reviews.push(item);
		}
	});
}

console.info("Checking for Review Statistic updates...");
const newReviewStatisticCache = await getReviewStatistics();
if (newReviewStatisticCache !== null) {
	cache.subjects.etags.reviewStatistics = newReviewStatisticCache.etag;
	newReviewStatisticCache.data.forEach((item) => {
		const subjectIndex = cache.subjects.data.findIndex((subject) => {
			return subject.subjectId === item.subject_id;
		});
		if (subjectIndex !== -1) {
			cache.subjects.data[subjectIndex].reviewStatistic = item;
		}
	});
}

console.info("Checking for Study Material updates...");
const newStudyMaterialCache = await getStudyMaterials();
if (newStudyMaterialCache !== null) {
	cache.subjects.etags.studyMaterials = newStudyMaterialCache.etag;
	newStudyMaterialCache.data.forEach((item) => {
		const subjectIndex = cache.subjects.data.findIndex((subject) => {
			return subject.subjectId === item.subject_id;
		});
		if (subjectIndex !== -1) {
			cache.subjects.data[subjectIndex].studyMaterials.push(item);
		}
	});
}

console.info("Checking for Summary updates...");
const newSummaryCache = await getSummary();
if (newSummaryCache !== null) {
	cache.summary = newSummaryCache;
}

console.info("Checking for User updates...");
const newUserCache = await getUser();
if (newUserCache !== null) {
	cache.user = newUserCache;
}

console.info("Checking for Voice Actor updates...");
const newVoiceActorCache = await getVoiceActors();
if (newVoiceActorCache !== null) {
	cache.voiceActors = newVoiceActorCache;
}

console.info("Sorting Subject Reviews...");

cache.subjects.data.forEach((item) => {
	item.reviews.sort((reviewA, reviewB) => {
		return new Date(reviewA.created_at).getTime() - new Date(reviewB.created_at).getTime();
	});
});

await fs.promises.writeFile(WANIKANI_CACHE_PATH, JSON.stringify(cache), "utf-8");

console.info("\n");
console.info("---------------------------------------");
console.info(`2/${TOTAL_STEPS} - Validate Blog Posts' Front Matter`);
console.info("---------------------------------------");

await verifyFrontMatter();

async function getLevelProgressions(): Promise<WaniKaniLevelProgressionCache | null> {
	let response = await fetchFromWaniKani(`${WANIKANI_BASE_URL}/level_progressions`, cache.levelProgressions.etag);
	if (response.status === HTTP_NOT_MODIFIED) {
		console.info("No Level Progression updates found, skipping...");
		return null;
	} else {
		console.info("Updating Level Progressions...");
		const etag = response.headers.get("Etag") ?? "";
		const levelProgressions: WKLevelProgressionData[] = [];
		let moreLevelProgressions = true;
		let collection = (await response.json()) as WKLevelProgressionCollection;
		while (moreLevelProgressions) {
			collection.data.forEach((item) => {
				levelProgressions.push(item.data);
			});
			if (collection.pages.next_url === null) {
				moreLevelProgressions = false;
			} else {
				response = await fetchFromWaniKani(collection.pages.next_url);
				collection = (await response.json()) as WKLevelProgressionCollection;
			}
		}
		return {
			etag,
			data: levelProgressions,
		};
	}
}

async function getResets(): Promise<WaniKaniResetCache | null> {
	let response = await fetchFromWaniKani(`${WANIKANI_BASE_URL}/resets`, cache.resets.etag);
	if (response.status === HTTP_NOT_MODIFIED) {
		console.info("No Reset updates found, skipping...");
		return null;
	} else {
		console.info("Updating Resets...");
		const etag = response.headers.get("Etag") ?? "";
		const resets: WKResetData[] = [];
		let moreResets = true;
		let collection = (await response.json()) as WKResetCollection;
		while (moreResets) {
			collection.data.forEach((item) => {
				resets.push(item.data);
			});
			if (collection.pages.next_url === null) {
				moreResets = false;
			} else {
				response = await fetchFromWaniKani(collection.pages.next_url);
				collection = (await response.json()) as WKResetCollection;
			}
		}
		return {
			etag,
			data: resets,
		};
	}
}

async function getSubjects(): Promise<WaniKaniSubjectCache | null> {
	const params: WKSubjectParameters = {
		hidden: false,
	};
	let response = await fetchFromWaniKani(`${WANIKANI_BASE_URL}/subjects`, cache.subjects.etags.subjects, params);
	if (response.status === HTTP_NOT_MODIFIED) {
		console.info("No Subject updates found, skipping...");
		return null;
	} else {
		console.info("Updating Subjects...");
		let moreSubjects = true;
		const subjectCache: WaniKaniSubjectCache = {
			etags: {
				subjects: response.headers.get("Etag") ?? "",
				assignments: "",
				reviews: "",
				reviewStatistics: "",
				studyMaterials: "",
			},
			data: [],
		};
		let subjectCollection = (await response.json()) as WKSubjectCollection;
		while (moreSubjects) {
			subjectCollection.data.forEach((item) => {
				const newSubjectCacheItem: WaniKaniSubjectItemCache = {
					subjectId: item.id,
					subjectType: item.object,
					subjectData: item.data,
					assignment: null,
					reviews: [],
					reviewStatistic: null,
					studyMaterials: [],
				};
				subjectCache.data.push(newSubjectCacheItem);
			});
			if (subjectCollection.pages.next_url === null) {
				moreSubjects = false;
			} else {
				response = await fetchFromWaniKani(subjectCollection.pages.next_url);
				subjectCollection = (await response.json()) as WKSubjectCollection;
			}
		}
		return subjectCache;
	}
}

async function getAssignments(): Promise<WaniKaniAssignmentCache | null> {
	const params: WKAssignmentParameters = {
		hidden: false,
	};
	let response = await fetchFromWaniKani(`${WANIKANI_BASE_URL}/assignments`, cache.subjects.etags.assignments, params);
	if (response.status === HTTP_NOT_MODIFIED) {
		console.info("No Assignment updates found, skipping...");
		return null;
	} else {
		console.info("Updating Assignments...");
		let moreAssignments = true;
		const etag = response.headers.get("Etag") ?? "";
		const assignmentData: WKAssignmentData[] = [];
		let assignmentCollection = (await response.json()) as WKAssignmentCollection;
		while (moreAssignments) {
			assignmentCollection.data.forEach((item) => {
				assignmentData.push(item.data);
			});
			if (assignmentCollection.pages.next_url === null) {
				moreAssignments = false;
			} else {
				response = await fetchFromWaniKani(assignmentCollection.pages.next_url);
				assignmentCollection = (await response.json()) as WKAssignmentCollection;
			}
		}
		return {
			etag,
			data: assignmentData,
		};
	}
}

async function getReviews(): Promise<WaniKaniReviewCache | null> {
	const levelOneResets = cache.resets.data.filter((reset) => {
		return reset.target_level === 1;
	});
	levelOneResets.sort((resetA, resetB) => {
		return new Date(resetA.created_at).getTime() - new Date(resetB.created_at).getTime();
	});
	const lastReset = levelOneResets.pop();
	if (typeof lastReset === "undefined") {
		throw new Error("Unexpected empty Level 1 Reset array");
	}
	const resetDate = lastReset.created_at;
	const reviewParams: WKReviewParameters = {
		updated_after: resetDate,
	};
	let response = await fetchFromWaniKani(`${WANIKANI_BASE_URL}/reviews`, cache.subjects.etags.reviews, reviewParams);
	if (response.status === HTTP_NOT_MODIFIED) {
		console.info("No Review updates found, skipping...");
		return null;
	} else {
		console.info("Updating Reviews...");
		const etag = response.headers.get("Etag") ?? "";
		let moreReviews = true;
		const reviewData: WKReviewData[] = [];
		let reviewCollection = (await response.json()) as WKReviewCollection;
		while (moreReviews) {
			reviewCollection.data.forEach((item) => {
				reviewData.push(item.data);
			});
			if (reviewCollection.pages.next_url === null) {
				moreReviews = false;
			} else {
				response = await fetchFromWaniKani(reviewCollection.pages.next_url);
				reviewCollection = (await response.json()) as WKReviewCollection;
			}
		}
		return {
			etag,
			data: reviewData,
		};
	}
}

async function getReviewStatistics(): Promise<WaniKaniReviewStatisticCache | null> {
	const params: WKReviewStatisticParameters = {
		hidden: false,
	};
	let response = await fetchFromWaniKani(
		`${WANIKANI_BASE_URL}/review_statistics`,
		cache.subjects.etags.reviewStatistics,
		params,
	);
	if (response.status === HTTP_NOT_MODIFIED) {
		console.info("No Review Statistic updates found, skipping...");
		return null;
	} else {
		console.info("Updating Review Statistics...");
		const etag = response.headers.get("Etag") ?? "";
		let moreReviewStatistics = true;
		let reviewStatisticCollection = (await response.json()) as WKReviewStatisticCollection;
		const reviewStatisticData: WKReviewStatisticData[] = [];
		while (moreReviewStatistics) {
			reviewStatisticCollection.data.forEach((item) => {
				reviewStatisticData.push(item.data);
			});
			if (reviewStatisticCollection.pages.next_url === null) {
				moreReviewStatistics = false;
			} else {
				response = await fetchFromWaniKani(reviewStatisticCollection.pages.next_url);
				reviewStatisticCollection = (await response.json()) as WKReviewStatisticCollection;
			}
		}
		return {
			etag,
			data: reviewStatisticData,
		};
	}
}

async function getStudyMaterials(): Promise<WaniKaniStudyMaterialCache | null> {
	const params: WKStudyMaterialParameters = {
		hidden: false,
	};
	let response = await fetchFromWaniKani(
		`${WANIKANI_BASE_URL}/study_materials`,
		cache.subjects.etags.studyMaterials,
		params,
	);
	if (response.status === HTTP_NOT_MODIFIED) {
		console.info("No Study Material updates found, skipping...");
		return null;
	} else {
		console.info("Updating Study Materials...");
		const etag = response.headers.get("Etag") ?? "";
		const studyMaterialData: WKStudyMaterialData[] = [];
		let moreStudyMaterials = true;
		let studyMaterialCollection = (await response.json()) as WKStudyMaterialCollection;
		while (moreStudyMaterials) {
			studyMaterialCollection.data.forEach((item) => {
				studyMaterialData.push(item.data);
			});
			if (studyMaterialCollection.pages.next_url === null) {
				moreStudyMaterials = false;
			} else {
				response = await fetchFromWaniKani(studyMaterialCollection.pages.next_url);
				studyMaterialCollection = (await response.json()) as WKStudyMaterialCollection;
			}
		}
		return {
			etag,
			data: studyMaterialData,
		};
	}
}

async function getSummary(): Promise<WaniKaniSummaryCache | null> {
	const response = await fetchFromWaniKani(`${WANIKANI_BASE_URL}/summary`, cache.summary.etag);
	if (response.status === HTTP_NOT_MODIFIED) {
		console.info("No Summary updates found, skipping...");
		return null;
	} else {
		console.info("Updating Summary...");
		const etag = response.headers.get("Etag") ?? "";
		const summary = (await response.json()) as WKSummary;
		return {
			etag,
			data: summary.data,
		};
	}
}

async function getUser(): Promise<WaniKaniUserCache | null> {
	const response = await fetchFromWaniKani(`${WANIKANI_BASE_URL}/user`, cache.user.etag);
	if (response.status === HTTP_NOT_MODIFIED) {
		console.info("No User updates found, skipping...");
		return null;
	} else {
		console.info("Updating User...");
		const etag = response.headers.get("Etag") ?? "";
		const user = (await response.json()) as WKUser;
		return {
			etag,
			data: user.data,
		};
	}
}

async function getVoiceActors(): Promise<WaniKaniVoiceActorCache | null> {
	let response = await fetchFromWaniKani(`${WANIKANI_BASE_URL}/voice_actors`, cache.voiceActors.etag);
	if (response.status === HTTP_NOT_MODIFIED) {
		console.info("No Voice Actor updates found, skipping...");
		return null;
	} else {
		console.info("Updating Voice Actors...");
		const etag = response.headers.get("Etag") ?? "";
		let collection = (await response.json()) as WKVoiceActorCollection;
		let moreVoiceActors = true;
		const voiceActors: WKVoiceActorData[] = [];
		while (moreVoiceActors) {
			collection.data.forEach((item) => {
				voiceActors.push(item.data);
			});
			if (collection.pages.next_url === null) {
				moreVoiceActors = false;
			} else {
				response = await fetchFromWaniKani(collection.pages.next_url);
				collection = (await response.json()) as WKVoiceActorCollection;
			}
		}
		return {
			etag,
			data: voiceActors,
		};
	}
}

async function fetchFromWaniKani<
	P extends WKCollectionParameters,
	T extends WKCollection | WKError | WKReport | WKResource,
>(url: string, etag?: string, params?: P): Promise<Response> {
	if (typeof process.env.WANIKANI_API_TOKEN === "undefined") {
		throw new Error("Missing WaniKani API Token");
	} else {
		const headers = new Headers({
			Authorization: `Bearer ${process.env.WANIKANI_API_TOKEN}`,
			"Wanikani-Revision": WK_API_REVISION,
		});
		if (typeof etag !== "undefined" && etag !== "") {
			headers.append("If-None-Match", etag);
		}
		const init = { headers };
		let baseUrl = url;
		if (typeof params !== "undefined") {
			baseUrl += stringifyParameters(params);
		}
		const initialResponse = await fetch(baseUrl, init);
		const returnedResponse = initialResponse.clone();
		if (initialResponse.status === HTTP_NOT_MODIFIED) {
			return returnedResponse;
		}
		const json = (await initialResponse.json()) as T;
		if (typeof json.error === "undefined") {
			return returnedResponse;
		} else {
			throw new Error(`${json.code} - ${json.error}`);
		}
	}
}

export async function verifyFrontMatter(): Promise<void> {
	const POSTS_PATH = path.join(process.cwd(), "blog");
	const initialPaths = await fs.promises.readdir(POSTS_PATH);
	const postFilePaths = initialPaths.filter((file) => {
		return /\.mdx?$/u.test(file);
	});
	const posts = await Promise.all(
		postFilePaths.map(async (filePath) => {
			const source = await fs.promises.readFile(path.join(POSTS_PATH, filePath));
			const content: MDXRemoteSerializeResult<Record<string, unknown>, BlogFrontMatter> = await serialize(source, {
				mdxOptions: {
					remarkPlugins: [remarkGfm],
					rehypePlugins: [],
				},
				parseFrontmatter: true,
			});
			const slug = filePath.replace(/\.mdx?$/u, "");

			const post: BlogPost = {
				content,
				slug,
			};
			return post;
		}),
	);
	posts.forEach((post) => {
		if (typeof post.content.frontmatter === "undefined") {
			throw new Error(`Missing Front Matter on Blog Post ${post.slug}.md`);
		} else {
			const missingFields: string[] = [];
			const exampleFrontMatter: BlogFrontMatter = {
				title: "Hello World",
				date: "2022-12-01",
				coverImage: "",
			};
			Object.keys(exampleFrontMatter).forEach((key) => {
				if (typeof post.content.frontmatter !== "undefined" && typeof post.content.frontmatter[key] === "undefined") {
					missingFields.push(key);
				}
			});
			if (missingFields.length > 0) {
				throw new Error(
					`Blog Post ${post.slug}.md is missing the following Front Matter fields: ${missingFields.toString()}`,
				);
			}
			isValidDate(post.slug, post.content.frontmatter.date);

			if (post.content.frontmatter.coverImage) {
				try {
					const url = new URL(post.content.frontmatter.coverImage);
					if (url.protocol !== "http:" && url.protocol !== "https:") {
						throw new Error("URL must be either HTTP or HTTPS.");
					}
				} catch (error) {
					if (error instanceof Error) {
						throw new Error(
							`Blog Post ${post.slug}.md has invalid URL: ${post.content.frontmatter.coverImage} - ${error.message}`,
						);
					} else {
						throw new Error(`Blog Post ${post.slug}.md has invalid URL ${post.content.frontmatter.coverImage}`);
					}
				}
			}
		}
	});
	console.info("All Blog Post Front Matter is valid!");
}

function isValidDate(slug: string, date: string): void {
	const datePattern = /(?<year>\d{4})-(?<month>[01]\d)-(?<day>[0-3]\d)/u;
	const matches = datePattern.exec(date);
	if (matches === null || typeof matches.groups === "undefined") {
		throw new Error(`Blog Post ${slug}.md has an invalid date, should be formatted as yyyy-mm-dd .`);
	}
	const year = parseInt(matches.groups.year, 10);
	const month = parseInt(matches.groups.month, 10);
	const day = parseInt(matches.groups.day, 10);
	const fourYears = 4;
	const oneHundredYears = 100;
	const fourHundredYears = 400;
	const isLeapYear = (year % fourYears === 0 && year % oneHundredYears !== 0) || year % fourHundredYears === 0;
	const monthsInYear = 12;
	const thirtyOneDays = 31;
	const thirtyDays = 30;
	const twentyNineDays = 29;
	const months = {
		january: 1,
		february: 2,
		march: 3,
		april: 4,
		may: 5,
		june: 6,
		july: 7,
		august: 8,
		september: 9,
		october: 10,
		november: 11,
		december: 12,
	};
	const monthsWithThirtyDays = [months.april, months.june, months.september, months.november];
	const monthsWithThirtyOneDays = [
		months.january,
		months.march,
		months.may,
		months.july,
		months.august,
		months.october,
		months.december,
	];
	if (month <= 0) {
		throw new Error(`Blog Post ${slug}.md has an invalid date, Month ${month} < 1.`);
	}
	if (month > monthsInYear) {
		throw new Error(`Blog Post ${slug}.md has an invalid date, Month ${month} > 12.`);
	}
	if (day <= 0) {
		throw new Error(`Blog Post ${slug}.md has an invalid date, Day ${day} < 1.`);
	}
	if (monthsWithThirtyOneDays.includes(month) && day > thirtyOneDays) {
		throw new Error(`Blog Post ${slug}.md has an invalid date, Month ${month} has 31 days, day is ${day}.`);
	}
	if (monthsWithThirtyDays.includes(month) && day > thirtyDays) {
		throw new Error(`Blog Post ${slug}.md has an invalid date, Month ${month} has 30 days, day is ${day}.`);
	}
	if (month === months.february && ((isLeapYear && day >= thirtyDays) || (!isLeapYear && day >= twentyNineDays))) {
		throw new Error(
			`Blog Post ${slug}.md has an invalid date, February has ${isLeapYear ? "29" : "28"} days, day is ${day}`,
		);
	}
}
