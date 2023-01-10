const commonHeadingClasses = "text-primary-content font-bold break-words my-5";
const normalTextClasses = "text-sm md:text-base text-base-content mb-4";
const listClasses = `${normalTextClasses} ml-11`;

export function BlockQuote(props: JSX.IntrinsicElements["blockquote"]): JSX.Element {
	return (
		<blockquote
			className="border-l-8 border-primary-content pl-2"
			{...props}
		/>
	);
}

export function BlogPostTitle(props: JSX.IntrinsicElements["span"]): JSX.Element {
	return (
		<span
			className={`mx-auto text-2xl md:text-4xl ${commonHeadingClasses}`}
			{...props}
		/>
	);
}

export function Heading1(props: JSX.IntrinsicElements["h1"]): JSX.Element {
	return (
		<h1
			className={`text-4xl md:text-6xl ${commonHeadingClasses}`}
			{...props}
		/>
	);
}

export function Heading2(props: JSX.IntrinsicElements["h2"]): JSX.Element {
	return (
		<h2
			className={`text-3xl md:text-5xl ${commonHeadingClasses}`}
			{...props}
		/>
	);
}

export function Heading3(props: JSX.IntrinsicElements["h3"]): JSX.Element {
	return (
		<h3
			className={`text-2xl md:text-4xl ${commonHeadingClasses}`}
			{...props}
		/>
	);
}

export function Heading4(props: JSX.IntrinsicElements["h4"]): JSX.Element {
	return (
		<h4
			className={`text-xl md:text-3xl ${commonHeadingClasses}`}
			{...props}
		/>
	);
}

export function Heading5(props: JSX.IntrinsicElements["h5"]): JSX.Element {
	return (
		<h5
			className={`text-lg md:text-2xl ${commonHeadingClasses}`}
			{...props}
		/>
	);
}

export function Heading6(props: JSX.IntrinsicElements["h6"]): JSX.Element {
	return (
		<h6
			className={`md:text-xl ${commonHeadingClasses}`}
			{...props}
		/>
	);
}

export function OrderedList(props: JSX.IntrinsicElements["ol"]): JSX.Element {
	return (
		<ol
			className={`list-decimal ${listClasses}`}
			{...props}
		/>
	);
}

export function Paragraph(props: JSX.IntrinsicElements["p"] & { indent?: number }): JSX.Element {
	let textClass = normalTextClasses;
	if (typeof props.indent !== "undefined" && props.indent) {
		textClass += " indent-6";
	}
	return (
		<p
			className={textClass}
			{...props}
		/>
	);
}

export function UnorderedList(props: JSX.IntrinsicElements["ul"]): JSX.Element {
	return (
		<ul
			className={`list-disc ${listClasses}`}
			{...props}
		/>
	);
}
