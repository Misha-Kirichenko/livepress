import { useCallback, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import AuthService from "../api/authService";
import NotificationService from "../api/notificationService";
import { useNavigate } from "react-router";
const { VITE_API_HOST } = import.meta.env;

export const useNotificationsSocket = (role, setNotifications) => {
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
					const createDate = modifyNotificationDateTime(notif.createDate);
					return {
						...notif,
						createDate
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

		socket.on("article:new", (data) => {
			setNotifications((prev) => {
				const found = prev.find(
					(notif) => notif.article_id === data.article_id
				);

				if (found) return prev;

				const createDate = modifyNotificationDateTime(data.createDate);

				const finalNotifData = {
					...data,
					createDate
				};

				return [...prev, finalNotifData];
			});
		});

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
