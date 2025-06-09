import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import AuthService from "../api/authService";
import { SOCKET_EVENTS } from "../constants";
const { VITE_API_HOST } = import.meta.env;

export const useArticleInteractions = (articleId, setReactions) => {
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

		return () => {
			socket.disconnect();
		};
	}, [articleId, setReactions]);
};
