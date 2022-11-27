/* eslint-disable no-await-in-loop -- We depend on the order of execution of promises to paginate through the WaniKani
API */
import type {
	WaniKaniCache,
	WaniKaniIndexGroup,
	WaniKaniIndexPageData,
	WaniKaniIndexRadical,
	WaniKaniSubjectItemCache,
} from "@/types";
import fs from "fs";
import path from "path";

const WANIKANI_CACHE_PATH = path.resolve(process.cwd(), ".wanikani");

export async function getWaniKaniIndexData(): Promise<WaniKaniIndexPageData> {
	const cache = await getWaniKaniCache();
	const burnedItems: WaniKaniIndexGroup = {
		name: "Burned Items",
		levels: {},
	};
	cache.subjects.data.forEach((subject) => {
		if (subject.assignment?.burned_at !== null) {
			handleIndexLevel(subject, burnedItems);
		}
	});
	if (cache.user.data === null) {
		throw new Error("Unexpected missing User data!");
	}
	const data: WaniKaniIndexPageData = {
		user: cache.user.data,
		groups: [burnedItems],
	};

	return data;
}

function handleIndexLevel(subject: WaniKaniSubjectItemCache, group: WaniKaniIndexGroup): void {
	if (typeof group.levels[subject.subjectData.level] === "undefined") {
		group.levels[subject.subjectData.level] = {
			radicals: [],
			kanji: [],
			vocabulary: [],
		};
	}
	if (subject.subjectType === "radical") {
		const radicalData: WaniKaniIndexRadical = {
			subjectId: subject.subjectId,
			subjectType: "radical",
			characters: subject.subjectData.characters ?? null,
			characterImage: null,
			meanings: subject.subjectData.meanings,
		};
		if (radicalData.characters === null) {
			const inlineCharacterImage = subject.subjectData.character_images?.find((image) => {
				return image.content_type === "image/svg+xml" && image.metadata.inline_styles === true;
			});
			if (typeof inlineCharacterImage !== "undefined") {
				radicalData.characterImage = inlineCharacterImage;
			}
		}
		group.levels[subject.subjectData.level]?.radicals?.push(radicalData);
	} else if (subject.subjectType === "kanji") {
		group.levels[subject.subjectData.level]?.kanji?.push({
			subjectId: subject.subjectId,
			subjectType: "kanji",
			characters: subject.subjectData.characters as string,
			meanings: subject.subjectData.meanings,
		});
	} else {
		group.levels[subject.subjectData.level]?.vocabulary?.push({
			subjectId: subject.subjectId,
			subjectType: "vocabulary",
			characters: subject.subjectData.characters as string,
			meanings: subject.subjectData.meanings,
		});
	}
}

export async function getWaniKaniCache(): Promise<WaniKaniCache> {
	const cacheFile = await fs.promises.readFile(WANIKANI_CACHE_PATH, "utf-8");
	return JSON.parse(cacheFile) as WaniKaniCache;
}
