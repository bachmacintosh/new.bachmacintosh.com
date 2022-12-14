import type {
	WKAssignmentData,
	WKKanjiData,
	WKLevel,
	WKLevelProgressionData,
	WKRadicalCharacterImage,
	WKRadicalData,
	WKResetData,
	WKReviewData,
	WKReviewStatisticData,
	WKStudyMaterialData,
	WKSubjectMeaning,
	WKSubjectType,
	WKSummaryData,
	WKUserData,
	WKVocabularyData,
	WKVoiceActorData,
} from "@bachmacintosh/wanikani-api-types/dist/v20170710";

/* Index Page */

export interface WaniKaniIndexPageData {
	user: WKUserData;
	groups: WaniKaniIndexGroup[];
}

export interface WaniKaniIndexGroup {
	name: string;
	levels: WaniKaniIndexLevels;
}

export type WaniKaniIndexLevels = Partial<Record<WKLevel, WaniKaniIndexLevel>>;

interface WaniKaniIndexLevel {
	radicals: WaniKaniIndexRadical[] | null;
	kanji: WaniKaniIndexKanji[] | null;
	vocabulary: WaniKaniIndexVocabulary[] | null;
}

interface WaniKaniIndexSubject<T extends WKSubjectType> {
	subjectId: number;
	subjectType: T;
	meanings: WKSubjectMeaning[];
}

export interface WaniKaniIndexKanji extends WaniKaniIndexSubject<"kanji"> {
	subjectType: "kanji";
	characters: string;
}

export interface WaniKaniIndexRadical extends WaniKaniIndexSubject<"radical"> {
	subjectType: "radical";
	characters: string | null;
	characterImage: WKRadicalCharacterImage | null;
}

export interface WaniKaniIndexVocabulary extends WaniKaniIndexSubject<"vocabulary"> {
	characters: string;
}

/* Level Pages */

/* Cache */

export interface WaniKaniCache {
	levelProgressions: WaniKaniLevelProgressionCache;
	resets: WaniKaniResetCache;
	subjects: WaniKaniSubjectCache;
	summary: WaniKaniSummaryCache;
	user: WaniKaniUserCache;
	voiceActors: WaniKaniVoiceActorCache;
}

interface BaseItemCache {
	etag: string;
}

export interface WaniKaniAssignmentCache extends BaseItemCache {
	data: WKAssignmentData[];
}

export interface WaniKaniLevelProgressionCache extends BaseItemCache {
	data: WKLevelProgressionData[];
}

export interface WaniKaniResetCache extends BaseItemCache {
	data: WKResetData[];
}

export interface WaniKaniReviewCache {
	data_updated_at: string;
	data: WKReviewData[];
}

export interface WaniKaniReviewStatisticCache extends BaseItemCache {
	data: WKReviewStatisticData[];
}

export interface WaniKaniStudyMaterialCache extends BaseItemCache {
	data: WKStudyMaterialData[];
}

export interface WaniKaniSubjectCache {
	etags: {
		assignments: string;
		reviewStatistics: string;
		studyMaterials: string;
		subjects: string;
	};
	reviews_updated_after: string;
	data: WaniKaniSubjectItemCache[];
}

export interface WaniKaniSubjectItemCache {
	subjectId: number;
	assignment: WKAssignmentData | null;
	reviews: WKReviewData[];
	reviewStatistic: WKReviewStatisticData | null;
	studyMaterials: WKStudyMaterialData[];
	subjectType: WKSubjectType;
	subjectData: WKKanjiData | WKRadicalData | WKVocabularyData;
}

export interface WaniKaniSummaryCache extends BaseItemCache {
	data: WKSummaryData | null;
}

export interface WaniKaniUserCache extends BaseItemCache {
	data: WKUserData | null;
}

export interface WaniKaniVoiceActorCache extends BaseItemCache {
	data: WKVoiceActorData[];
}
