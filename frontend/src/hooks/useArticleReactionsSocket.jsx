import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import AuthService from "../api/authService";
const { VITE_API_HOST } = import.meta.env;

export const useArticleReactionsSocket = (articleId, setReactions) => {
	const socketRef = useRef(null);

	useEffect(() => {
		const socket = io(`${VITE_API_HOST}/reactions`, {
			auth: { token: AuthService.getToken("access") }
		});

		socketRef.current = socket;

		socket.emit("joinArticleRoom", articleId);

		socket.on("connect_error", (err) => {
			if (!socket.active) {
				console.error("Socket auth failed:", err.message);
			}
		});

		socket.on("reaction:toggle", (data) => {
			setReactions((prev) => {
				if (prev.likes === data.likes && prev.dislikes === data.dislikes)
					return prev;
				return data;
			});
		});

		return () => {
			socket.disconnect();
		};
	}, [articleId, setReactions]);
};
