import * as he from "he";

const hasVisibleText = (html) => {
	const withoutTags = html.replace(/<[^>]*>/g, "");
	const decoded = he.decode(withoutTags);
	return decoded.trim().length > 0;
};

export default hasVisibleText;
