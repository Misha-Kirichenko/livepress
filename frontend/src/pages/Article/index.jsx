import {
	Box,
	Typography,
	Avatar,
	Stack,
	Divider,
	CardMedia
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useNavigate, useParams } from "react-router";
import * as he from "he";
import AuthContext from "../../contexts/AuthContext";
import CommentItem from "../../components/CommentItem";
import useArticle from "../../hooks/useArticle";
import { API_HOST, DEFAULT_IMG_URL } from "../../constants";
import Reactions from "../../components/Reactions";
import useReactions from "../../hooks/useReactions";
import { useContext, useMemo } from "react";
import ErrorPage from "../../components/ErrorPage";
import CommentInput from "../../components/CommentInput";
import ArticleService from "../../api/articleService";
import AuthService from "../../api/authService";
import Loader from "../../components/Loader";
import { useArticleInteractions } from "../../hooks/useArticleInteractions";
import Header from "../../components/Header";
import GoHome from "../../components/GoHome";
import TextButton from "../../components/TextButton";
import useArticleComments from "../../hooks/useArticleComments";

const Article = () => {
	const commentsLimit = 5;
	const navigate = useNavigate();
	const userData = useContext(AuthContext);
	const { id } = useParams();

	const { article, isLoading: isArticleLoading, setArticle } = useArticle(id);

	const {
		comments,
		isLoading: isCommentsLoading,
		isLoadingMore,
		loadMore,
		setComments,
		hasMore,
		page,
		limit
	} = useArticleComments(id, commentsLimit);

	const {
		reactions,
		isLoading: isReactionsLoading,
		setIsLoading: setReactionsLoading,
		setReactions
	} = useReactions(id);

	useArticleInteractions(
		id,
		setReactions,
		{ page, limit, setComments },
		commentsLimit
	);

	const formattedDate = useMemo(() => {
		if (!article?.createDate) return "";
		const date = new Date(Number(article.createDate));
		return date.toLocaleString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false
		});
	}, [article?.createDate]);

	if (isArticleLoading) return <Loader type="block" width="250" height="250" />;
	if (isCommentsLoading)
		return <Loader type="block" width="250" height="250" />;
	if (!article) return <ErrorPage text="Article" status={404} />;

	const {
		title,
		author,
		category,
		description,
		img,
		reaction: myReaction,
		subOnCategory
	} = article;
	const [authorFname, authorLname] = author.fullName.split(" ");
	const authorInitials = `${authorFname[0]}.${authorLname[0]}`;

	const handleReaction = async (reaction) => {
		try {
			setReactionsLoading(true);
			const reactionData = await ArticleService.setArticleReaction(
				id,
				reaction
			);
			if (reactionData.status == 200) {
				setArticle((prev) => ({
					...prev,
					reaction: prev.reaction === reaction ? null : reaction
				}));
				setReactions(reactionData.data);
			}
		} catch (error) {
			if (error.response?.status === 401) {
				AuthService.clearTokens();
				navigate("/login");
			}
		} finally {
			setReactionsLoading(false);
		}
	};

	return (
		<>
			<Header />
			<Box sx={{ maxWidth: "800px", margin: "0 auto", padding: 3 }}>
				<Typography variant="h4" gutterBottom>
					{title}
				</Typography>

				<Stack direction="row" spacing={2} alignItems="center" mb={2}>
					<Avatar sx={{ width: 32, height: 32 }}>{authorInitials}</Avatar>
					<Typography variant="body2" color="text.secondary">
						<b>author:&nbsp;</b>
						{userData.role === "USER" ? (
							author.fullName
						) : userData.id === author.author_id ? (
							<u>
								<i>ME</i>
							</u>
						) : (
							author.fullName
						)}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{formattedDate}
					</Typography>
					<Typography
						variant="body2"
						color="primary"
						sx={{ fontStyle: "italic", ml: "auto" }}
					>
						Category: {category}
						{userData.role === "USER" && !subOnCategory
							? " (not subscribed)"
							: ""}
					</Typography>
					{userData.role == "ADMIN" && userData.id === author.author_id && (
						<Link to={`/article/edit/${id}`}>
							<EditIcon sx={{ cursor: "pointer" }} />
						</Link>
					)}
				</Stack>

				<Divider sx={{ mb: 2 }} />
				<CardMedia
					component="img"
					image={img ? `${API_HOST}/${img}` : DEFAULT_IMG_URL}
					alt={title}
					sx={{ mb: 4 }}
				/>

				<Box
					component="div"
					dangerouslySetInnerHTML={{
						__html: he.decode(description)
					}}
				/>
				<Divider sx={{ mb: 2 }} />

				{isReactionsLoading ? (
					<Loader type="block" height="25px" width="25px" align="flex-end" />
				) : (
					<Reactions
						role={userData.role}
						handleReaction={handleReaction}
						isReactionsLoading={isReactionsLoading}
						reactions={{
							myReaction: myReaction || null,
							...reactions
						}}
					/>
				)}
				<Typography variant="h6" gutterBottom mt={4}>
					{comments.data.length ? "Comments" : "No comments yet"}
				</Typography>
				{userData.role === "USER" && (
					<CommentInput
						setComments={setComments}
						articleId={id}
						limit={commentsLimit}
					/>
				)}
				<Box mt={2}>
					{comments.data.map((comment, index) => (
						<CommentItem
							key={`comment-${index}-${comment.id}`}
							commentData={comment}
							page={page}
							limit={limit}
							article_id={id}
							setComments={setComments}
						/>
					))}

					{hasMore && (
						<Box display="flex" justifyContent="center" mt={2}>
							{isLoadingMore ? (
								<Loader
									type="inline"
									height="25px"
									width="25px"
									align="flex-start"
								/>
							) : (
								<TextButton
									text="load more"
									action={loadMore}
									disabled={isLoadingMore}
								/>
							)}
						</Box>
					)}
				</Box>

				<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
					<GoHome />
				</Box>
			</Box>
		</>
	);
};

export default Article;
