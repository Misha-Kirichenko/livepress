import * as he from "he";
import { Avatar, Box, Typography, Stack, Paper } from "@mui/material";
import AuthContext from "../../contexts/AuthContext";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import CommentService from "../../api/commentService";
import AuthService from "../../api/authService";
import { useNavigate } from "react-router";
import ActionsPanel from "./ActionsPanel";
import ItemText from "./ItemText";
import EditPanel from "./EditPanel";
import ConfirmModal from "../ConfirmModal";
import { commentAuthorPropTypes } from "../../propTypes/commentAuthorPropTypes";
import { handleSetCommentsAfterDelete } from "../../handlers/handleSetCommentsAfterDelete";

const modes = ["view", "edit"];

const CommentItem = ({ commentData, setComments }) => {
	const navigate = useNavigate();
	const { showSnackbar } = useSnackbar();
	const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
	const [mode, setMode] = useState(modes[0]);
	const [editedText, setEditedText] = useState("");
	const userData = useContext(AuthContext);
	const { id, text, author, createDate, updateDate } = commentData;
	const fullName = he.decode(`${author.name} ${author.surname}`);
	const fnameInitial = author.name[0].toUpperCase();
	const lnameInitial = author.surname[0].toUpperCase();

	const initials = `${fnameInitial}.${lnameInitial}`;

	const isAuthorBlocked = Boolean(author.isBlocked);
	const canSeeBlockedInfo = userData.role === "ADMIN" && isAuthorBlocked;

	const handleDelete = async () => {
		try {
			const response = await CommentService.deleteArticleComment(id);
			handleSetCommentsAfterDelete(setComments, id);
			showSnackbar({
				open: true,
				message: response.data.message,
				severity: "success"
			});
		} catch (error) {
			showSnackbar({
				open: true,
				message: error.response.data.message,
				severity: "error"
			});
		} finally {
			setConfirmModalIsOpen(false);
		}
	};

	const handleSaveEdited = async () => {
		try {
			const response = await CommentService.updateArticleComment(id, {
				text: editedText
			});

			setComments((prevComments) => {
				const updatedComments = [...prevComments.data];
				const foundIndex = updatedComments.findIndex(
					(comment) => comment.id === id
				);
				updatedComments.splice(foundIndex, 1, response.data);

				return {
					data: updatedComments,
					total: prevComments.total
				};
			});
		} catch (error) {
			if (error.response?.status === 401) {
				AuthService.clearTokens();
				navigate("/login");
			}
			showSnackbar({
				open: true,
				message: error.response.data.message,
				severity: "error"
			});
		} finally {
			setMode(modes[0]);
			setEditedText("");
		}
	};

	const handleEditMode = (mode) => {
		setMode(mode);
		if (mode === modes[1]) {
			setEditedText(text);
		} else if (mode === modes[0]) {
			setEditedText("");
		}
	};

	let formattedDate = new Date(Number(createDate));

	formattedDate = formattedDate.toLocaleString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false
	});

	if (Number(updateDate)) {
		let updateFormattedDate = new Date(Number(updateDate));
		updateFormattedDate = updateFormattedDate.toLocaleString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false
		});
		formattedDate = `Posted: ${formattedDate}, Edited: ${updateFormattedDate}`;
	}

	return (
		<Paper
			variant="outlined"
			sx={{
				p: 2,
				mb: 2,
				position: "relative",
				opacity: canSeeBlockedInfo ? 0.4 : 1,
				backgroundColor: canSeeBlockedInfo ? "#f5f5f5" : "inherit"
			}}
		>
			<ConfirmModal
				open={confirmModalIsOpen}
				onClose={setConfirmModalIsOpen}
				onConfirm={handleDelete}
				message={`Are you sure you want to delete comment: <b>"${he.decode(
					text
				)}"</b>?`}
			/>
			<ActionsPanel
				author={author}
				handlers={{
					setConfirmModalIsOpen,
					handleEditMode,
					handleDelete,
					setComments
				}}
			/>

			<Stack direction="row" spacing={2} alignItems="flex-start">
				<Avatar>{initials}</Avatar>
				<Box flex={1}>
					<Typography variant="subtitle2">
						{fullName}&nbsp;
						<sup style={{ fontWeight: "bold", fontStyle: "italic" }}>
							{author.nickName}
						</sup>
					</Typography>
					<Typography variant="body2" color="text.secondary" mb={1}>
						{formattedDate}
					</Typography>
					{mode === modes[0] ? (
						<ItemText text={text} author={author} userRole={userData.role} />
					) : mode === modes[1] &&
					  userData.role === "USER" &&
					  author.nickName === userData.nickName ? (
						<EditPanel
							editedText={editedText}
							setEditedText={setEditedText}
							handleEditMode={handleEditMode}
							handleSaveEdited={handleSaveEdited}
						/>
					) : (
						""
					)}
				</Box>
			</Stack>
		</Paper>
	);
};

CommentItem.propTypes = {
	commentData: PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		text: PropTypes.string.isRequired,
		createDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
			.isRequired,
		updateDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		author: commentAuthorPropTypes
	}).isRequired,
	setComments: PropTypes.func.isRequired
};

export default CommentItem;
