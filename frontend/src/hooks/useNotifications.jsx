import { useCallback, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import AuthService from "../api/authService";
import NotificationService from "../api/notificationService";
import { useNavigate } from "react-router";
import { SOCKET_EVENTS } from "../constants";
const { VITE_API_HOST } = import.meta.env;

export const useNotifications = (role, setNotifications) => {
	const socketRef = useRef(null);
	const navigate = useNavigate();

	const modifyNotificationDateTime = (timestamp) => {
		const createDate = new Date(timestamp);
		const formattedDateTime = createDate.toLocaleString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false
		});
		return formattedDateTime;
	};

	const handleSetNotifications = useCallback(
		(notifications) => {
			setNotifications(() => {
				const newNotifications = notifications.map((notif) => {
					return {
						...notif,
						createDate: notif.createDate,
						formattedCreateDate: modifyNotificationDateTime(notif.createDate)
					};
				});
				return newNotifications;
			});
		},
		[setNotifications]
	);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await NotificationService.getAll();
				handleSetNotifications(response.data);
			} catch (error) {
				if (error.response.status === 401) {
					AuthService.clearTokens();
					navigate("/login");
				}
			}
		};

		fetchNotifications();
		const socket = io(`${VITE_API_HOST}/notifications/${role.toLowerCase()}`, {
			auth: { token: AuthService.getToken("access") }
		});

		socketRef.current = socket;

		if (role === "USER") {
			socket.on(SOCKET_EVENTS.ARTICLE.NEW, (data) => {
				setNotifications((prev) => {
					const found = prev.find((notif) => notif.notifId === data.notifId);

					if (found) return prev;

					const finalNotifData = {
						...data,
						createDate: data.createDate,
						formattedCreateDate: modifyNotificationDateTime(data.createDate)
					};

					return [...prev, finalNotifData].toSorted(
						(a, b) => b.createDate - a.createDate
					);
				});
			});
		} else if (role === "ADMIN") {
			socket.on(SOCKET_EVENTS.ARTICLE.REACTION, (data) => {
				setNotifications((prev) => {
					const foundIndex = prev.findIndex(
						(notif) =>
							notif.article_id === data.article_id &&
							notif.user_id === data.user_id &&
							notif.type === data.type
					);

					if (foundIndex === -1)
						return [
							...prev,
							{
								...data,
								createDate: data.createDate,
								formattedCreateDate: modifyNotificationDateTime(data.createDate)
							}
						].toSorted((a, b) => b.createDate - a.createDate);

					const withReplacement = [...prev];
					if (data.message) {
						withReplacement.splice(foundIndex, 1, {
							...data,
							createDate: data.createDate,
							formattedCreateDate: modifyNotificationDateTime(data.createDate)
						});
					} else {
						withReplacement.splice(foundIndex, 1);
					}

					return withReplacement.toSorted(
						(a, b) => b.createDate - a.createDate
					);
				});
			});
			socket.on(SOCKET_EVENTS.ARTICLE.NEW_COMMENT, (data) => {
				setNotifications((prev) => [
					{
						...data,
						createDate: data.createDate,
						formattedCreateDate: modifyNotificationDateTime(data.createDate)
					},
					...prev
				]);
			});
		}

		socket.on("connect_error", (err) => {
			if (!socket.active) {
				console.error("Socket auth failed:", err.message);
			}
		});

		return () => {
			socket.disconnect();
		};
	}, [role, setNotifications, navigate, handleSetNotifications]);
};
