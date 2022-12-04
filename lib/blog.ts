import type { BlogFrontMatter, BlogPost, BlogPostMetadata, BlogPostPath } from "@/types";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import remarkGfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";

const POSTS_PATH = path.join(process.cwd(), "blog");

export async function getBlogPost(slug: string): Promise<BlogPost> {
	const postFilePath = path.join(POSTS_PATH, `${slug}.mdx`);
	const source = await fs.promises.readFile(postFilePath);
	const { content, data } = matter(source);
	const frontMatter: BlogFrontMatter = {
		fields: {
			title: slug,
		},
	};
	if (typeof data.title === "string") {
		frontMatter.fields.title = data.title;
	}
	const mdx = await serialize(content, {
		mdxOptions: {
			remarkPlugins: [remarkGfm],
			rehypePlugins: [],
		},
		scope: data,
	});
	return {
		mdx,
		frontMatter,
	};
}

export async function getAllBlogPosts(): Promise<BlogPostMetadata[]> {
	const initialPaths = await fs.promises.readdir(POSTS_PATH);
	const postFilePaths = initialPaths.filter((file) => {
		return /\.mdx?$/u.test(file);
	});
	const posts = await Promise.all(
		postFilePaths.map(async (filePath) => {
			const source = await fs.promises.readFile(path.join(POSTS_PATH, filePath));
			const { data, excerpt } = matter(source, { excerpt: true });
			const slug = filePath.replace(/\.mdx?$/u, "");
			let title = slug;
			if (typeof data.title === "string") {
				({ title } = data);
			}
			const postMetadata: BlogPostMetadata = {
				frontMatter: {
					excerpt,
					fields: {
						title,
					},
				},
				slug,
			};
			return postMetadata;
		}),
	);
	return posts;
}

export async function getBlogPostPaths(): Promise<BlogPostPath[]> {
	const initialPaths = await fs.promises.readdir(POSTS_PATH);
	const postFilePaths = initialPaths.filter((file) => {
		return /\.mdx?$/u.test(file);
	});
	const paths = postFilePaths
		.map((filePath) => {
			return filePath.replace(/\.mdx?$/u, "");
		})
		.map((slug) => {
			return {
				params: {
					slug,
				},
			};
		});
	return paths;
}
