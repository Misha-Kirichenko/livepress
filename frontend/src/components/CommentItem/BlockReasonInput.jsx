import PropTypes from "prop-types";
import { Box, Button, Popover, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { commentAuthorPropTypes } from "../../propTypes/commentAuthorPropTypes";
import AdminService from "../../api/adminService";
import AuthService from "../../api/authService";
import { useNavigate } from "react-router";

const BlockReasonInput = ({ fields, handlers }) => {
	const navigate = useNavigate();
	const { open, anchorEl, author } = fields;
	const { setAnchorEl, setComments } = handlers;
	const [reason, setReason] = useState("");
	const [error, setError] = useState("");

	const handleSetReason = (value) => {
		setError("");
		setReason(value);
	};

	const handleClosePopover = () => {
		setAnchorEl(null);
		setError("");
		setReason("");
	};

	const handleConfirmBlock = async () => {
		if (reason.trim().length && reason.trim().length < 10) {
			const ERROR_MESSAGE =
				"If reason is present it should be more than 10 characters long";
			setError(ERROR_MESSAGE);
			return;
		}

		try {
			await AdminService.toggleBlockUser(author.nickName, {
				isBlocked: true,
				...(reason && { reason })
			});
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
		} catch (error) {
			if (error.response?.status === 401) {
				AuthService.clearTokens();
				navigate("/login");
			}

			if (error.response?.status === 400) {
				const errorText = "Ooops! Something went wrong...";
				setError(errorText);
				return;
			}
		}
	};

	return (
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
					<Button variant="outlined" size="small" onClick={handleClosePopover}>
						Cancel
					</Button>
					<Button variant="contained" size="small" onClick={handleConfirmBlock}>
						OK
					</Button>
				</Box>
			</Box>
		</Popover>
	);
};

BlockReasonInput.propTypes = {
	handlers: PropTypes.shape({
		setAnchorEl: PropTypes.func.isRequired,
		setComments: PropTypes.func.isRequired
	}).isRequired,
	fields: PropTypes.shape({
		open: PropTypes.bool.isRequired,
		anchorEl: PropTypes.oneOfType([
			PropTypes.instanceOf(Element),
			PropTypes.func,
			PropTypes.object
		]),
		author: commentAuthorPropTypes
	}).isRequired
};

export default BlockReasonInput;
