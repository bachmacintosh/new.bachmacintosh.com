export interface CloudinaryResourceOptions {
	prefix?: string;
	public_ids?: string[];
	max_results?: number;
	next_cursor?: string;
	start_at?: string;
	direction?: number | string;
	tags?: boolean;
	context?: boolean;
	moderation?: boolean;
	metadata?: boolean;
}

export interface CloudinaryResource {
	asset_id: string;
	public_id: string;
	format: string;
	version: number;
	resource_type: string;
	type: string;
	created_at: string;
	bytes: number;
	width: number;
	height: number;
	folder: string;
	url: string;
	secure_url: string;
	tags?: string[];
	context?: {
		custom: {
			caption?: string;
			alt?: string;
		};
	};
}

export interface CloudinaryResourceCollection {
	resources: CloudinaryResource[];
	next_cursor?: string;
}
