import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import AuthService from "../api/authService";
import { SOCKET_EVENTS } from "../constants";
import { handleSetNewComment } from "../handlers/handleSetNewComment";
import { refetchCommentsAfterDelete } from "../handlers/refetchCommentsAfterDelete";
const { VITE_API_HOST } = import.meta.env;

export const useArticleInteractions = (
	articleId,
	setReactions,
	{ setComments, page, limit },
	commentsLimit
) => {
	const socketRef = useRef(null);

	useEffect(() => {
		const socket = io(`${VITE_API_HOST}/articleInteractions`, {
			auth: { token: AuthService.getToken("access") }
		});

		socketRef.current = socket;

		socket.emit(SOCKET_EVENTS.ARTICLE.VISIT, articleId);

		socket.on("connect_error", (err) => {
			if (!socket.active) {
				console.error("Socket auth failed:", err.message);
			}
		});

		socket.on(SOCKET_EVENTS.ARTICLE.REACTION, (data) => {
			setReactions((prev) => {
				if (
					prev.likes === data.payload.likes &&
					prev.dislikes === data.payload.dislikes
				)
					return prev;
				return data.payload;
			});
		});

		socket.on(SOCKET_EVENTS.ARTICLE.COMMENT_ADD, ({ payload }) => {
			handleSetNewComment(setComments, payload, commentsLimit);
		});

		socket.on(SOCKET_EVENTS.ARTICLE.COMMENT_UPDATE, ({ payload }) => {
			setComments((prevComments) => {
				const updatedComments = [...prevComments.data];
				const commentIndex = updatedComments.findIndex(
					(comment) => comment.id === payload.id
				);
				if (commentIndex !== -1)
					updatedComments.splice(commentIndex, 1, payload);

				return {
					data: updatedComments,
					total: prevComments.total
				};
			});
		});

		socket.on(SOCKET_EVENTS.ARTICLE.COMMENT_DELETE, async () => {
			console.log("refetched comments");
			await refetchCommentsAfterDelete(setComments, page, limit, articleId);
		});

		return () => {
			socket.disconnect();
		};
	}, [articleId, setReactions, setComments, commentsLimit, page, limit]);
};
