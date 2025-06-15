import {
	Box,
	Button,
	CardMedia,
	Container,
	InputLabel,
	MenuItem,
	TextField,
	Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import * as he from "he";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";

const ArticleForm = ({
	formData,
	categories,
	validationErrors,
	articleDataHandlers,
	mode
}) => {
	const { title, description, category, previewUrl, imageFile } = formData;
	const {
		handleChangeArticleData,
		handleImageChange,
		handleSave,
		handleRemoveImage
	} = articleDataHandlers;

	return (
		<Container maxWidth="md">
			{mode === "edit" ? (
				<Typography variant="h4" gutterBottom>
					Edit article{title && `: "${title}"`}
				</Typography>
			) : mode === "create" ? (
				<Typography variant="h4" gutterBottom>
					New article{title && `: "${title}"`}
				</Typography>
			) : (
				""
			)}

			<Box
				component="form"
				noValidate
				autoComplete="off"
				sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}
			>
				<Box>
					<CardMedia
						component="img"
						image={previewUrl}
						alt={title}
						sx={{ mb: 2, borderRadius: 2 }}
					/>
					<Button variant="outlined" component="label">
						<FileUploadIcon />
						Upload image
						<input
							type="file"
							accept="image/*"
							hidden
							onChange={handleImageChange}
						/>
					</Button>

					<Button
						variant="outlined"
						component="label"
						sx={{ ml: 4 }}
						onClick={handleRemoveImage}
					>
						<DeleteIcon />
						Remove image
					</Button>
					{imageFile && (
						<Typography variant="body2" sx={{ mt: 1 }}>
							{imageFile.name}
						</Typography>
					)}
					{validationErrors.img && (
						<Typography
							variant="caption"
							color="error"
							sx={{ minHeight: 20, mt: 1, ml: 2 }}
						>
							{validationErrors.img}
						</Typography>
					)}
				</Box>

				<Box>
					<TextField
						label="Title"
						variant="outlined"
						fullWidth
						value={title}
						onChange={handleChangeArticleData("title")}
					/>
					{validationErrors.title && (
						<Typography variant="caption" color="error" sx={{ minHeight: 20 }}>
							{validationErrors.title}
						</Typography>
					)}
				</Box>

				<Box>
					<TextField
						select
						label="Category"
						variant="outlined"
						fullWidth
						value={category}
						onChange={handleChangeArticleData("category")}
					>
						{Array.isArray(categories) && categories.length > 0 ? (
							categories.map((cat) => (
								<MenuItem key={cat.id} value={cat.id}>
									{cat.name}
								</MenuItem>
							))
						) : (
							<MenuItem disabled value="">
								No available categories
							</MenuItem>
						)}
					</TextField>
					{validationErrors.category && (
						<Typography
							variant="caption"
							color="error"
							sx={{ minHeight: 20, mt: 5 }}
						>
							{validationErrors.category}
						</Typography>
					)}
				</Box>

				<Box>
					<InputLabel sx={{ mb: 1 }}>Description</InputLabel>
					<ReactQuill
						theme="snow"
						value={he.decode(description)}
						onChange={handleChangeArticleData("description")}
					/>
					{validationErrors.description && (
						<Typography
							variant="caption"
							color="error"
							sx={{ minHeight: 20, my: 4 }}
						>
							{validationErrors.description}
						</Typography>
					)}
				</Box>

				<Button variant="contained" color="primary" onClick={handleSave}>
					Save
				</Button>
			</Box>
		</Container>
	);
};

ArticleForm.propTypes = {
	formData: PropTypes.shape({
		title: PropTypes.string,
		description: PropTypes.string,
		category: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
			.isRequired,
		previewUrl: PropTypes.string.isRequired,
		imageFile: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])])
	}),
	categories: PropTypes.oneOfType([
		PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.number.isRequired,
				name: PropTypes.string.isRequired
			})
		),
		PropTypes.oneOf([null])
	]),
	validationErrors: PropTypes.shape({
		title: PropTypes.string,
		category: PropTypes.string,
		img: PropTypes.string,
		description: PropTypes.string
	}),
	articleDataHandlers: PropTypes.shape({
		handleChangeArticleData: PropTypes.func.isRequired,
		handleImageChange: PropTypes.func.isRequired,
		handleSave: PropTypes.func.isRequired,
		handleRemoveImage: PropTypes.func.isRequired
	}).isRequired,
	mode: PropTypes.oneOf(["edit", "create"]).isRequired
};

export default ArticleForm;
