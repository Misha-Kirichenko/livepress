import { Box, Paper, Typography, ClickAwayListener, Fade } from "@mui/material";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import { useContext, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import ProfileMenu from "./ProfileMenu";
import { useNavigate } from "react-router";
import { useNotificationsSocket } from "../../hooks/useNotificationsSocket";
import NotificationService from "../../api/notificationService";

const Header = () => {
	const userData = useContext(AuthContext);
	const [open, setOpen] = useState(false);
	const [notifications, setNotifications] = useState([]);
	useNotificationsSocket(userData.role, setNotifications);
	const navigate = useNavigate();

	const handleToggle = () => setOpen((prev) => !prev);
	const handleClose = () => setOpen(false);

	const handleNavigate = async (article_id) => {
		await handleMarkAsRead(article_id);
		navigate(`/article/${article_id}`);
	};

	const handleMarkAsRead = async (article_id) => {
		try {
			const response = await NotificationService.markAsRead(article_id);
			if (response.status === 204) {
				setNotifications((prev) =>
					prev.filter((article) => article.article_id !== article_id)
				);
			}
		} catch (error) {
			console.error("Error marking notification as read:", error);
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "flex-end",
				cursor: "pointer",
				height: "70px"
			}}
		>
			<Box
				sx={{
					width: "35%",
					display: "flex",
					height: "100px",
					justifyContent: "flex-end",
					position: "relative"
				}}
			>
				<ClickAwayListener onClickAway={handleClose}>
					<Box sx={{ paddingTop: "15px", display: "flex" }}>
						<span onClick={handleToggle}>
							{notifications.length > 0 && (
								<sup style={{ color: "red" }}>{notifications.length}</sup>
							)}
							<NotificationsRoundedIcon />
						</span>
						<span
							style={{ marginLeft: "8px" }}
						>{`${userData.name[0]}.${userData.surname[0]}`}</span>

						<Fade in={open}>
							<Paper
								elevation={3}
								sx={{
									position: "absolute",
									top: "45px",
									right: 0,
									width: "300px",
									borderRadius: "10px",
									padding: "10px",
									zIndex: 999
								}}
							>
								{!notifications.length ? (
									<Box
										sx={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
											padding: "20px",
											color: "gray"
										}}
									>
										<NotificationsOffOutlinedIcon
											sx={{ fontSize: 40, mb: 1 }}
										/>
										<Typography variant="body2">
											No new notifications
										</Typography>
									</Box>
								) : (
									notifications.map((notif, index) => (
										<Box
											key={`${notif.article_id}-${index}`}
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "flex-start",
												padding: "8px",
												borderBottom: "1px solid #eee"
											}}
										>
											<Box
												sx={{ flex: 1, cursor: "pointer" }}
												onClick={() => handleNavigate(notif.article_id)}
											>
												<Typography
													variant="subtitle2"
													fontWeight="bold"
													sx={{
														display: "-webkit-box",
														WebkitLineClamp: 2,
														WebkitBoxOrient: "vertical",
														overflow: "hidden",
														textOverflow: "ellipsis"
													}}
												>
													{notif.message}
												</Typography>
												<Typography variant="caption" color="gray">
													{notif.createDate}
												</Typography>
											</Box>

											<Box
												sx={{
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													justifyContent: "flex-start",
													marginLeft: "10px",
													cursor: "pointer"
												}}
												onClick={() => handleMarkAsRead(notif.article_id)}
											>
												<Typography
													variant="caption"
													color="gray"
													sx={{
														fontSize: "10px",
														marginBottom: "2px",
														lineHeight: 1
													}}
												>
													Mark as read
												</Typography>
												<Box
													sx={{
														width: "10px",
														height: "10px",
														borderRadius: "50%",
														backgroundColor: "red"
													}}
												/>
											</Box>
										</Box>
									))
								)}
							</Paper>
						</Fade>
					</Box>
				</ClickAwayListener>
				<ProfileMenu />
			</Box>
		</Box>
	);
};

export default Header;
