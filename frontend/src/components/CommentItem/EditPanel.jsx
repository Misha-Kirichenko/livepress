import PropTypes from "prop-types";
import * as he from "he";
import { Box, Button, TextField } from "@mui/material";

const EditPanel = ({
	editedText,
	setEditedText,
	handleEditMode,
	handleSaveEdited
}) => {
	return (
		<Box sx={{ flex: 1 }}>
			<TextField
				fullWidth
				multiline
				minRows={3}
				maxRows={6}
				placeholder="Leave a comment..."
				variant="outlined"
				value={he.decode(editedText)}
				onChange={(e) => setEditedText(e.target.value)}
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
					onClick={() => handleEditMode("view")}
				>
					cancel
				</Button>
				{Boolean(editedText.trim().length) && (
					<Button variant="contained" size="small" onClick={handleSaveEdited}>
						save
					</Button>
				)}
			</Box>
		</Box>
	);
};

EditPanel.propTypes = {
	editedText: PropTypes.string.isRequired,
	setEditedText: PropTypes.func.isRequired,
	handleEditMode: PropTypes.func.isRequired,
	handleSaveEdited: PropTypes.func.isRequired
};

export default EditPanel;
