import { useState } from "react";
import { Grid, Container, Pagination, Box } from "@mui/material";
import Article from "./Article";
import ArticleFilters from "./ArticleFilters";
import useArticles from "../../hooks/useArticles";

const ArticleList = () => {
	const [queryParams, setQueryParams] = useState({
		page: 1,
		search: "",
		category_id: "",
		limit: 12
	});

	const handleSetParam = (paramName, value) => {
		setQueryParams((prev) => ({
			...prev,
			[paramName]: value
		}));
	};

	const { articles, isLoading } = useArticles(queryParams);

	if (isLoading) {
		return "Loading...";
	}

	const totalPages = Math.ceil(articles.total / queryParams.limit);

	return (
		<Container sx={{ py: 4 }}>
			<ArticleFilters queryParamsData={{ queryParams, handleSetParam }} />
			<Grid container spacing={4}>
				{articles.data.map((article, index) => (
					<Grid item key={`${article.id}-${index}`} xs={12} sm={6} md={4}>
						<Article articleData={article} />
					</Grid>
				))}
			</Grid>

			{totalPages > 1 && (
				<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
					<Pagination
						count={totalPages}
						page={queryParams.page}
						onChange={(_, value) => handleSetParam("page", value)}
						color="primary"
						shape="rounded"
					/>
				</Box>
			)}
		</Container>
	);
};

export default ArticleList;
