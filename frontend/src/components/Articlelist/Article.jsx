import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router";
import EditIcon from "@mui/icons-material/Edit";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextButton from "../TextButton";
import { Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { API_HOST, DEFAULT_IMG_URL } from "../../constants";
import { useContext, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import ConfirmModal from "../ConfirmModal";
import ArticleService from "../../api/articleService";
import { useSnackbar } from "../../contexts/SnackbarProvider";
import AuthService from "../../api/authService";

const Article = ({
	articleData,
	setArticles,
	pageTotal,
	queryParams,
	handleSetParam
}) => {
	const { showSnackbar } = useSnackbar();

	const navigate = useNavigate();
	const { id, title, category, author, author_id, img, createDate } =
		articleData;

	const [confirmModalOpen, setConfirmModalOpen] = useState(false);
	const [[firstNameInit], [lastNameInit]] = author.split(" ");

	const { role, id: user_id } = useContext(AuthContext);

	const date = new Date(Number(createDate));

	const formattedDate = date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});

	const DELETE_MODAL_MESSAGE = `Are you sure you want to delete article with title: "<b><i>${title}</i></b>"`;

	const handleDeleteArticle = async () => {
		try {
			const {
				data: { message }
			} = await ArticleService.deleteArticle(id);
			if (pageTotal === 1) {
				handleSetParam((prev) => {
					return {
						...prev,
						page: prev.page > 1 ? prev.page - 1 : 1
					};
				});
			}
			const afterDeleteArticles = await ArticleService.getArticles(queryParams);
			setArticles(afterDeleteArticles.data);
			showSnackbar({
				open: true,
				message,
				severity: "success"
			});
		} catch (error) {
			const {
				data: { message },
				status
			} = error.response;
			if (status === 401) {
				AuthService.clearTokens();
				navigate("/login");
			} else if (status === 404) {
				showSnackbar({
					open: true,
					message,
					severity: "warning"
				});
			} else {
				showSnackbar({
					open: true,
					message,
					severity: "error"
				});
			}
		}
		setConfirmModalOpen(false);
	};

	return (
		<>
			<Card sx={{ maxWidth: 345, width: "100%" }}>
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<CardHeader
						avatar={
							<Avatar aria-label="author">{`${firstNameInit}.${lastNameInit}`}</Avatar>
						}
						title={title}
						subheader={formattedDate}
					/>
					{role == "ADMIN" && author_id === user_id && (
						<Box
							sx={{
								display: "flex",
								width: "25%",
								justifyContent: "flex-end",
								gap: "1em"
							}}
						>
							<Link to={`/article/edit/${id}`}>
								<EditIcon sx={{ cursor: "pointer" }} />
							</Link>
							<DeleteIcon
								sx={{ cursor: "pointer" }}
								onClick={() => setConfirmModalOpen(true)}
							/>
						</Box>
					)}
				</Box>
				<CardMedia
					component="img"
					height="194"
					image={img ? `${API_HOST}/${img}` : DEFAULT_IMG_URL}
					alt={title}
				/>
				<CardContent>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1
						}}
					>
						<Typography variant="body1" fontWeight="bold">
							Category:
						</Typography>
						<Typography variant="body1" color="text.secondary">
							{category}
							{Object.prototype.hasOwnProperty.call(
								articleData,
								"subOnCategory"
							) &&
								!articleData.subOnCategory && <sup>&nbsp;not subscibed</sup>}
						</Typography>
						<Box style={{ marginLeft: "auto" }}>
							<TextButton
								text="read"
								action={() => navigate(`/article/${id}`)}
							/>
						</Box>
					</Box>
				</CardContent>
			</Card>
			<ConfirmModal
				open={confirmModalOpen}
				onClose={setConfirmModalOpen}
				message={DELETE_MODAL_MESSAGE}
				onConfirm={handleDeleteArticle}
			/>
		</>
	);
};

Article.propTypes = {
	articleData: PropTypes.shape({
		id: PropTypes.number.isRequired,
		title: PropTypes.string.isRequired,
		category: PropTypes.string.isRequired,
		author: PropTypes?.string,
		img: PropTypes.string,
		author_id: PropTypes.number.isRequired,
		subOnCategory: PropTypes.bool,
		createDate: PropTypes.string
	}),
	pageTotal: PropTypes.number.isRequired,
	queryParams: PropTypes.shape({
		page: PropTypes.number.isRequired,
		search: PropTypes.string,
		category_id: PropTypes.string,
		limit: PropTypes.number.isRequired
	}).isRequired,
	handleSetParam: PropTypes.func.isRequired,
	setArticles: PropTypes.func.isRequired
};

export default Article;
