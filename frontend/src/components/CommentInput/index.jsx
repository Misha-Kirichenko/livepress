import PropTypes from "prop-types";
import { Avatar, Box, TextField, Button, Stack } from "@mui/material";
import { useState, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import CommentService from "../../api/commentService";
import AuthService from "../../api/authService";
import { useNavigate } from "react-router";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import { handleSetNewComment } from "../../handlers/handleSetNewComment";

const CommentInput = ({ setComments, articleId, limit }) => {
	const { showSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const { name, surname } = useContext(AuthContext);
	const [comment, setComment] = useState("");

	const handleSubmit = async () => {
		if (comment.trim()) {
			try {
				const createdComment = await CommentService.createArticleComment(
					articleId,
					{ text: comment }
				);
				handleSetNewComment(setComments, createdComment.data, limit);
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
				setComment("");
			}
		}
	};

	const initials = `${name[0]}.${surname[0]}`;

	return (
		<Stack direction="row" spacing={2} alignItems="flex-start" mt={4}>
			<Avatar>{initials}</Avatar>
			<Box sx={{ flex: 1 }}>
				<TextField
					fullWidth
					multiline
					minRows={3}
					maxRows={6}
					placeholder="Leave a comment..."
					variant="outlined"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>
				<Box sx={{ textAlign: "right", mt: 1 }}>
					<Button
						variant="contained"
						size="small"
						onClick={handleSubmit}
						disabled={!comment.trim()}
					>
						Submit
					</Button>
				</Box>
			</Box>
		</Stack>
	);
};

CommentInput.propTypes = {
	setComments: PropTypes.func.isRequired,
	limit: PropTypes.number,
	articleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default CommentInput;
