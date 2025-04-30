import {
	Box,
	Typography,
	Avatar,
	Stack,
	Divider,
	CardMedia
} from "@mui/material";
import { useParams } from "react-router";
import Header from "../../components/Header";
import AuthContext from "../../contexts/AuthContext";
import useAuth from "../../hooks/useAuth";
import useArticle from "../../hooks/useArticle";
import { DEFAULT_IMG_URL } from "../../constants";
import Reactions from "../../components/Reactions";
import useReactions from "../../hooks/useReactions";

const Article = () => {
	const authData = useAuth();
	const { userData } = authData;

	const { id } = useParams();
	const { article, isLoading: isArticleLoading } = useArticle(id);
	const { reactions, isLoading: isReactionsLoading } = useReactions(id);

	if (!userData) return "loading...";
	if (isArticleLoading) return "loading...";
	if (isReactionsLoading) return "loading...";

	const { title, author, createDate, category, description, img } = article;

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
		<AuthContext.Provider value={userData && authData}>
			<Header />
			<Box sx={{ maxWidth: "800px", margin: "0 auto", padding: 3 }}>
				<Typography variant="h4" gutterBottom>
					{title}
				</Typography>
				<Stack direction="row" spacing={2} alignItems="center" mb={2}>
					<Avatar sx={{ width: 32, height: 32 }}>
						{userData.role === "USER"
							? `${author.split(" ")[0][0]}.${author.split(" ")[1][0]}`
							: `${userData.name[0]}.${userData.surname[0]}`}
					</Avatar>
					{author ? (
						<Typography variant="body2" color="text.secondary">
							<b>author:&nbsp;</b>
							{author}
						</Typography>
					) : (
						""
					)}
					<Typography variant="body2" color="text.secondary">
						{formattedDate}
					</Typography>
					<Typography
						variant="body2"
						color="primary"
						sx={{ fontStyle: "italic", ml: "auto" }}
					>
						Category: {category}
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
		</AuthContext.Provider>
	);
};

export default Article;
