import {
	Box,
	Typography,
	Avatar,
	Stack,
	Divider,
	CardMedia
} from "@mui/material";
import { useParams } from "react-router";
import AuthContext from "../../contexts/AuthContext";
import useArticle from "../../hooks/useArticle";
import { DEFAULT_IMG_URL } from "../../constants";
import Reactions from "../../components/Reactions";
import useReactions from "../../hooks/useReactions";
import { useContext } from "react";
import NotFound from "../../components/NotFound";

const Article = () => {
	const userData = useContext(AuthContext);

	const { id } = useParams();
	const { article, isLoading: isArticleLoading } = useArticle(id);
	const { reactions, isLoading: isReactionsLoading } = useReactions(id);

	if (!article) return <NotFound text="Article" />;

	if (isArticleLoading) return "loading...";
	if (isReactionsLoading) return "loading...";

	const { title, author, createDate, category, description, img } = article;

	const [authorFname, authorLname] = author.fullName.split(" ");
	const authorInitials = `${authorFname[0]}.${authorLname[0]}`;

	const date = new Date(Number(createDate));

	const formattedDate = date.toLocaleString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false
	});

	return (
		<Box sx={{ maxWidth: "800px", margin: "0 auto", padding: 3 }}>
			<Typography variant="h4" gutterBottom>
				{title}
			</Typography>
			<Stack direction="row" spacing={2} alignItems="center" mb={2}>
				<Avatar sx={{ width: 32, height: 32 }}>{authorInitials}</Avatar>
				<Typography variant="body2" color="text.secondary">
					<b>author:&nbsp;</b>
					{userData.role === "USER"
						? author.fullName
						: userData.id === author.id
						? "Me"
						: author.fullName}
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
					{!article.subOnCategory ? " (not subscribed)" : ""}
				</Typography>
			</Stack>

			<Divider sx={{ mb: 2 }} />
			<CardMedia
				component="img"
				image={img || DEFAULT_IMG_URL}
				alt={title}
				sx={{ mb: 4 }}
			/>

			<Typography variant="body1" sx={{ whiteSpace: "pre-line" }} mb={4}>
				{description}
			</Typography>
			<Reactions
				role={userData.role}
				reactions={{
					myReaction: article.reaction || null,
					...reactions
				}}
			/>
		</Box>
	);
};

export default Article;
