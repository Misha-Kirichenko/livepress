import {
	Avatar,
	Box,
	Typography,
	Stack,
	IconButton,
	Paper,
	Tooltip
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

const CommentItem = ({ commentData, setComments }) => {
	const { showSnackbar } = useSnackbar();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const userData = useContext(AuthContext);
	const { text, author, createDate } = commentData;
	const fullName = `${author.name} ${author.surname}`;
	const fnameInitial = author.name[0].toUpperCase();
	const lnameInitial = author.surname[0].toUpperCase();

	const initials = `${fnameInitial}.${lnameInitial}`;

	const handleDelete = async () => {
		try {
			const response = await CommentService.deleteArticleComment(
				commentData.id
			);

			showSnackbar({
				open: true,
				message: response.data.message,
				severity: "success"
			});
		} catch (error) {
			console.error("Error deleting comment:", error);
		} finally {
			setComments((prevComments) => ({
				data: prevComments.data.filter(
					(comment) => comment.id !== commentData.id
				),
				total: prevComments.total - 1
			}));
			setDeleteModalOpen(false);
		}
	};

	const handleBlock = () => {
		console.log("Block user", commentData.author);
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
							<IconButton size="small" onClick={handleBlock}>
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
					<Typography
						variant="body1"
						sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
					>
						{he.decode(text)}
					</Typography>
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
		author: PropTypes.shape({
			name: PropTypes.string.isRequired,
			surname: PropTypes.string.isRequired,
			nickName: PropTypes.string.isRequired
		}).isRequired
	}).isRequired,
	setComments: PropTypes.func.isRequired
};

export default CommentItem;
