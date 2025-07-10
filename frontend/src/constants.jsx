export const DEFAULT_IMG_URL = "/default-picture.jpg";
export const LOADER_URL = "/loader.gif";
export const API_HOST = import.meta.env.VITE_API_HOST;
export const SOCKET_EVENTS = {
	ARTICLE: {
		VISIT: "article:visit",
		NEW: "article:new",
		REACTION: "article:reaction",
		COMMENT_ADD: "article:comment:add",
		NEW_COMMENT: "article:comment:new",
		COMMENT_UPDATE: "article:comment:update",
		COMMENT_DELETE: "article:comment:delete"
	}
};
