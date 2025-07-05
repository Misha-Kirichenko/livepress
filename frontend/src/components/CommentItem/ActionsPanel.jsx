import PropTypes from "prop-types";
import {
	Box,
	IconButton,
	Tooltip,
	TextField,
	Button,
	Popover,
	Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { useContext, useState } from "react";
import AuthContext from "../../contexts/AuthContext";

const ActionsPanel = ({ author, handlers }) => {
	const userData = useContext(AuthContext);
	const { setConfirmModalIsOpen, setComments, handleEditMode } = handlers;

	const [anchorEl, setAnchorEl] = useState(null);
	const [reason, setReason] = useState("");
	const [error, setError] = useState("");

	const handleOpenPopover = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleSetReason = (value) => {
		setError("");
		setReason(value);
	};

	const handleClosePopover = () => {
		setAnchorEl(null);
		setError("");
		setReason("");
	};

	const open = Boolean(anchorEl);

	const handleConfirmBlock = () => {
		if (reason.trim().length < 10) {
			setError("Reason must be at least 10 characters long.");
			return;
		}

		setComments((prev) => {
			const modifiedComments = prev?.data.map((comment) => {
				if (comment.author.nickName === author.nickName) {
					return {
						...comment,
						author: {
							...comment.author,
							isBlocked: true,
							blockReason: reason
						}
					};
				}
				return comment;
			});
			return {
				data: modifiedComments,
				total: prev.total
			};
		});

		handleClosePopover();
	};

	const handleUnblock = () => {
		setComments((prev) => {
			const modifiedComments = prev?.data.map((comment) => {
				if (comment.author.nickName === author.nickName) {
					return {
						...comment,
						author: {
							...comment.author,
							isBlocked: false,
							reason: null
						}
					};
				}
				return comment;
			});
			return {
				data: modifiedComments,
				total: prev.total
			};
		});
	};

	return (
		<Box
			sx={{
				position: "absolute",
				top: 8,
				right: 8,
				display: "flex",
				gap: 1
			}}
		>
			{userData.role === "ADMIN" ? (
				<>
					<Tooltip title="Delete comment">
						<IconButton
							size="small"
							onClick={() => setConfirmModalIsOpen(true)}
						>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</Tooltip>

					<Tooltip title={author.isBlocked ? "Unblock user" : "Block user"}>
						<IconButton
							size="small"
							onClick={(e) =>
								author.isBlocked ? handleUnblock() : handleOpenPopover(e)
							}
						>
							<PersonOffIcon
								fontSize="small"
								color={author.isBlocked ? "error" : "inherit"}
							/>
						</IconButton>
					</Tooltip>

					<Popover
						open={open}
						anchorEl={anchorEl}
						onClose={handleClosePopover}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "center"
						}}
						transformOrigin={{
							vertical: "top",
							horizontal: "center"
						}}
					>
						<Box
							sx={{
								p: 2,
								display: "flex",
								flexDirection: "column",
								gap: 1,
								minWidth: 220
							}}
						>
							<TextField
								label="Block reason"
								value={reason}
								onChange={(e) => handleSetReason(e.target.value)}
								size="small"
								multiline
								rows={1}
								autoFocus
							/>

							<Typography color="error" variant="span">
								{error ? error : ""}
							</Typography>
							<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
								<Button
									variant="outlined"
									size="small"
									onClick={handleClosePopover}
								>
									Cancel
								</Button>
								<Button
									variant="contained"
									size="small"
									onClick={handleConfirmBlock}
								>
									OK
								</Button>
							</Box>
						</Box>
					</Popover>
				</>
			) : userData.role === "USER" && author.nickName === userData.nickName ? (
				<>
					<Tooltip title="Delete my comment">
						<IconButton
							size="small"
							onClick={() => setConfirmModalIsOpen(true)}
						>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</Tooltip>
					<Tooltip title="Edit my comment">
						<IconButton size="small" onClick={() => handleEditMode("edit")}>
							<EditIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</>
			) : null}
		</Box>
	);
};

ActionsPanel.propTypes = {
	handlers: PropTypes.shape({
		setConfirmModalIsOpen: PropTypes.func.isRequired,
		setComments: PropTypes.func.isRequired,
		handleEditMode: PropTypes.func.isRequired
	}).isRequired,
	author: PropTypes.object.isRequired
};

export default ActionsPanel;
