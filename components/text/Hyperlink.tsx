import Link from "next/link";

export default function Hyperlink(props: JSX.IntrinsicElements["a"]): JSX.Element {
	const linkClass = "text-primary-content hover:text-base-content underline";
	const external = typeof props.href !== "undefined" && /^https?:\/\//u.test(props.href);
	if (external) {
		return (
			<a
				className={linkClass}
				href={props.href ?? "#"}
				target="_blank"
				rel="nofollow noopener noreferrer"
			>
				{props.children}
			</a>
		);
	} else {
		return (
			<Link
				className={linkClass}
				href={props.href ?? "#"}
			>
				{props.children}
			</Link>
		);
	}
}
