import { useCallback, useState } from "react";
import { Grid, Container, Pagination, Box } from "@mui/material";
import ArticleFilters from "./ArticleFilters";
import useArticles from "../../hooks/useArticles";
import Article from "./Article";

const ArticleList = () => {
	const initialQueryParams = localStorage.getItem("queryParams")
		? JSON.parse(localStorage.getItem("queryParams"))
		: {
				page: 1,
				search: "",
				category_id: "",
				limit: 12
		  };
	const [queryParams, setQueryParams] = useState(initialQueryParams);

	const handleSetParam = useCallback(
		(paramName, value) => {
			setQueryParams((prev) => {
				const updatedParams = {
					...prev,
					[paramName]: value,
					...(paramName === "search" && { page: 1 })
				};

				const queryParamsEmpty = (params) => {
					const copy = { ...params };
					delete copy.page;
					delete copy.limit;
					return Object.values(copy).every((val) => !val) && params.page === 1;
				};

				if (queryParamsEmpty(updatedParams)) {
					localStorage.removeItem("queryParams");
				} else {
					localStorage.setItem("queryParams", JSON.stringify(updatedParams));
				}

				return updatedParams;
			});
		},
		[setQueryParams]
	);

	const { articles, setArticles, isLoading } = useArticles(queryParams);

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
						<Article
							articleData={article}
							setArticles={setArticles}
							pageTotal={articles.data.length}
							queryParams={queryParams}
							handleSetParam={handleSetParam}
						/>
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
