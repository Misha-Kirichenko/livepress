import PropTypes from "prop-types";
import { Box, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { useContext, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import BlockReasonInput from "./BlockReasonInput";
import { commentAuthorPropTypes } from "../../propTypes/commentAuthorPropTypes";
import AdminService from "../../api/adminService";
import AuthService from "../../api/authService";
import { useNavigate } from "react-router";
import { useSnackbar } from "../../contexts/SnackbarProvider";

const ActionsPanel = ({ author, handlers }) => {
	const navigate = useNavigate();
	const { showSnackbar } = useSnackbar();
	const userData = useContext(AuthContext);
	const { setConfirmModalIsOpen, setComments, handleEditMode } = handlers;

	const [anchorEl, setAnchorEl] = useState(null);

	const handleOpenPopover = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const open = Boolean(anchorEl);

	const handleUnblock = async () => {
		try {
			await AdminService.toggleBlockUser(author.nickName, {
				isBlocked: false
			});
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
		} catch (error) {
			if (error.response?.status === 401) {
				AuthService.clearTokens();
				navigate("/login");
			}

			if (error.response?.status === 400) {
				showSnackbar({
					open: true,
					message: "Oops! Something went wrong...",
					severity: "error"
				});
			}
		}
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

					<BlockReasonInput
						fields={{ open, anchorEl, author }}
						handlers={{ setAnchorEl, setComments }}
					/>
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
	author: commentAuthorPropTypes
};

export default ActionsPanel;
