import { Box, IconButton, Tooltip } from "@mui/material";
import * as he from "he";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import ConfirmModal from "../ConfirmModal";
import { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";

const ActionsPanel = ({
	comment,
	deleteModalOpen,
	setDeleteModalOpen,
	handleEditMode,
	handleDelete,
	handleBlock
}) => {
	const userData = useContext(AuthContext);
	const { author, text } = comment;

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
					<Tooltip title={author.isBlocked ? "Unblock user" : "Block user"}>
						<IconButton size="small" onClick={handleBlock}>
							<PersonOffIcon
								fontSize="small"
								color={author.isBlocked ? "error" : "inherit"}
							/>
						</IconButton>
					</Tooltip>
				</>
			) : userData.role === "USER" && author.nickName === userData.nickName ? (
				<>
					<Tooltip title="Delete my comment">
						<IconButton size="small" onClick={() => setDeleteModalOpen(true)}>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</Tooltip>
					<Tooltip title="Edit my comment">
						<IconButton size="small" onClick={() => handleEditMode("edit")}>
							<EditIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</>
			) : (
				""
			)}
		</Box>
	);
};

export default ActionsPanel;
