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
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useState, useEffect, useRef } from "react";

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

	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	);
	const isInitializedRef = useRef(false);

	useEffect(() => {
		if (!isInitializedRef.current && description) {
			const contentBlock = htmlToDraft(he.decode(description));
			if (contentBlock) {
				const contentState = ContentState.createFromBlockArray(
					contentBlock.contentBlocks
				);
				setEditorState(EditorState.createWithContent(contentState));
				isInitializedRef.current = true;
			}
		}
	}, [description]);

	const handleEditorChange = (newState) => {
		setEditorState(newState);
		const html = draftToHtml(convertToRaw(newState.getCurrentContent()));
		handleChangeArticleData("description")({ target: { value: html } });
	};

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
					<Editor
						editorState={editorState}
						wrapperClassName="demo-wrapper"
						editorClassName="demo-editor"
						onEditorStateChange={handleEditorChange}
						editorStyle={{
							direction: "ltr",
							textAlign: "left",
							border: "1px solid gray",
							borderRadius: "4px",
							padding: "8px",
							minHeight: "200px"
						}}
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
		handleRemoveImage: PropTypes.func
	}).isRequired,
	mode: PropTypes.oneOf(["edit", "create"]).isRequired
};

export default ArticleForm;
