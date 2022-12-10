import type { BlogPost, BlogPostPath } from "@/types";
import fs from "fs";
import path from "path";
import remarkGfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";

const POSTS_PATH = path.join(process.cwd(), "blog");

export async function getBlogPost(year: string, month: string, day: string, slug: string): Promise<BlogPost> {
	const postFilePath = path.join(POSTS_PATH, year, month, day, `${slug}.mdx`);
	const source = await fs.promises.readFile(postFilePath);
	const content = await serialize(source, {
		mdxOptions: {
			remarkPlugins: [remarkGfm],
			rehypePlugins: [],
		},
		parseFrontmatter: true,
	});
	return {
		content,
		slug,
	};
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
	const posts: BlogPost[] = [];
	const initialPaths = await fs.promises.readdir(POSTS_PATH, { withFileTypes: true });
	const yearFolders = initialPaths
		.filter((dirent) => {
			return dirent.isDirectory();
		})
		.map((dirent) => {
			return dirent.name;
		});
	await Promise.all(
		yearFolders.map(async (year) => {
			const yearPath = path.join(POSTS_PATH, year);
			const initialMonthPaths = await fs.promises.readdir(yearPath, { withFileTypes: true });
			const monthFolders = initialMonthPaths
				.filter((dirent) => {
					return dirent.isDirectory();
				})
				.map((dirent) => {
					return dirent.name;
				});
			await Promise.all(
				monthFolders.map(async (month) => {
					const monthPath = path.join(POSTS_PATH, year, month);
					const initialDayPaths = await fs.promises.readdir(monthPath, { withFileTypes: true });
					const dayFolders = initialDayPaths
						.filter((dirent) => {
							return dirent.isDirectory();
						})
						.map((dirent) => {
							return dirent.name;
						});
					await Promise.all(
						dayFolders.map(async (day) => {
							const initialPostPath = path.join(POSTS_PATH, year, month, day);
							const initialPostFiles = await fs.promises.readdir(initialPostPath);
							const postFiles = initialPostFiles.filter((file) => {
								return /\.mdx?$/u.test(file);
							});
							await Promise.all(postFiles.map(async (file) => {
								const slug = file.replace(/\.mdx?$/u, "");
								const source = await fs.promises.readFile(path.join(POSTS_PATH, year, month, day, file));
								const content = await serialize(source, {
									mdxOptions: {
										remarkPlugins: [remarkGfm],
										rehypePlugins: [],
									},
									parseFrontmatter: true,
								});
								posts.push({
									content,
									slug
								});
							}));
						}),
					);
				}),
			);
		}),
	);
	posts.sort((postA, postB) => {
		if (typeof postA.content.frontmatter === "undefined" || typeof postB.content.frontmatter === "undefined") {
			throw new Error("Missing date field in Front Matter!");
		}
		return new Date(postB.content.frontmatter.date).getTime() - new Date(postA.content.frontmatter.date).getTime();
	});
	return posts;
}

export async function getBlogPostPaths(): Promise<BlogPostPath[]> {
	const paths: BlogPostPath[] = [];
	const initialPaths = await fs.promises.readdir(POSTS_PATH, { withFileTypes: true });
	const yearFolders = initialPaths
		.filter((dirent) => {
			return dirent.isDirectory();
		})
		.map((dirent) => {
			return dirent.name;
		});
	await Promise.all(
		yearFolders.map(async (year) => {
			const yearPath = path.join(POSTS_PATH, year);
			const initialMonthPaths = await fs.promises.readdir(yearPath, { withFileTypes: true });
			const monthFolders = initialMonthPaths
				.filter((dirent) => {
					return dirent.isDirectory();
				})
				.map((dirent) => {
					return dirent.name;
				});
			await Promise.all(
				monthFolders.map(async (month) => {
					const monthPath = path.join(POSTS_PATH, year, month);
					const initialDayPaths = await fs.promises.readdir(monthPath, { withFileTypes: true });
					const dayFolders = initialDayPaths
						.filter((dirent) => {
							return dirent.isDirectory();
						})
						.map((dirent) => {
							return dirent.name;
						});
					await Promise.all(
						dayFolders.map(async (day) => {
							const initialPostPath = path.join(POSTS_PATH, year, month, day);
							const initialPostFiles = await fs.promises.readdir(initialPostPath);
							const postFiles = initialPostFiles.filter((file) => {
								return /\.mdx?$/u.test(file);
							});
							postFiles.forEach((file) => {
								const slug = file.replace(/\.mdx?$/u, "");
								paths.push({
									params: {
										year,
										month,
										day,
										slug,
									},
								});
							});
						}),
					);
				}),
			);
		}),
	);
	return paths;
}
