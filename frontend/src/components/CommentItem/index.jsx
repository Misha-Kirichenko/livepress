import {
	Avatar,
	Box,
	Typography,
	Stack,
	IconButton,
	Paper,
	Tooltip,
	TextField,
	Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonOffIcon from "@mui/icons-material/PersonOff"; // более понятная иконка
import AuthContext from "../../contexts/AuthContext";
import PropTypes from "prop-types";
import * as he from "he";
import ConfirmModal from "../ConfirmModal"; // Assuming you have a ConfirmModal component
import { useContext, useState } from "react";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import CommentService from "../../api/commentService";
import AuthService from "../../api/authService";
import { useNavigate } from "react-router";


const modes = ["view", "edit"];

const CommentItem = ({ commentData, setComments }) => {
	const navigate = useNavigate();
	const { showSnackbar } = useSnackbar();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [mode, setMode] = useState(modes[0]);
	const [editedText, setEditedText] = useState("");
	const userData = useContext(AuthContext);
	const { id, text, author, createDate, updateDate } = commentData;
	const fullName = `${author.name} ${author.surname}`;
	const fnameInitial = author.name[0].toUpperCase();
	const lnameInitial = author.surname[0].toUpperCase();

	const initials = `${fnameInitial}.${lnameInitial}`;

	const handleDelete = async () => {
		try {
			const response = await CommentService.deleteArticleComment(id);
			setComments((prevComments) => ({
				data: prevComments.data.filter((comment) => comment.id !== id),
				total: prevComments.total - 1
			}));
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
			setDeleteModalOpen(false);
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

	const handleBlock = () => {
		console.log("Block user", commentData.author);
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
				position: "relative"
			}}
		>
			<Box
				sx={{
					position: "absolute",
					top: 8,
					right: 8,
					display: "flex",
					gap: 1
				}}
			>
				<ConfirmModal
					open={deleteModalOpen}
					onClose={setDeleteModalOpen}
					onConfirm={handleDelete}
					message={`Are you sure you want to delete comment: <b>"${he.decode(
						text
					)}"</b>?`}
				/>

				{userData.role === "ADMIN" ? (
					<>
						<Tooltip title="Delete comment">
							<IconButton size="small" onClick={() => setDeleteModalOpen(true)}>
								<DeleteIcon fontSize="small" />
							</IconButton>
						</Tooltip>
						<Tooltip title="Block user">
							<IconButton size="small" onClick={handleBlock}>
								<PersonOffIcon fontSize="small" />
							</IconButton>
						</Tooltip>
					</>
				) : userData.role === "USER" &&
				  author.nickName === userData.nickName ? (
					<>
						<Tooltip title="Delete my comment">
							<IconButton size="small" onClick={() => setDeleteModalOpen(true)}>
								<DeleteIcon fontSize="small" />
							</IconButton>
						</Tooltip>
						<Tooltip title="Edit my comment">
							<IconButton size="small" onClick={() => handleEditMode(modes[1])}>
								<EditIcon fontSize="small" />
							</IconButton>
						</Tooltip>
					</>
				) : (
					""
				)}
			</Box>

			<Stack direction="row" spacing={2} alignItems="flex-start">
				<Avatar>{initials}</Avatar>
				<Box flex={1}>
					<Typography variant="subtitle2">
						{fullName}&nbsp;
						<sup>
							<b>
								<i>{author.nickName}</i>
							</b>
						</sup>
					</Typography>
					<Typography variant="body2" color="text.secondary" mb={1}>
						{formattedDate}
					</Typography>
					{mode === modes[0] ? (
						<Typography
							variant="body1"
							sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
						>
							{he.decode(text)}
						</Typography>
					) : mode === modes[1] &&
					  userData.role === "USER" &&
					  author.nickName === userData.nickName ? (
						<Box sx={{ flex: 1 }}>
							<TextField
								fullWidth
								multiline
								minRows={3}
								maxRows={6}
								placeholder="Leave a comment..."
								variant="outlined"
								value={he.decode(editedText)}
								onInput={(e) => setEditedText(e.target.value)}
							/>
							<Box
								sx={{
									display: "flex",
									justifyContent: "flex-end",
									mt: 1,
									gap: 1
								}}
							>
								<Button
									variant="outlined"
									size="small"
									onClick={() => handleEditMode(modes[0])}
								>
									cancel
								</Button>
								{Boolean(editedText.trim().length) && (
									<Button
										variant="contained"
										size="small"
										onClick={handleSaveEdited}
									>
										save
									</Button>
								)}
							</Box>
						</Box>
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
		author: PropTypes.shape({
			name: PropTypes.string.isRequired,
			surname: PropTypes.string.isRequired,
			nickName: PropTypes.string.isRequired
		}).isRequired
	}).isRequired,
	setComments: PropTypes.func.isRequired
};

export default CommentItem;
