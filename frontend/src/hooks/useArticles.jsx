import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AuthService from "../api/authService";
import ArticleService from "../api/articleService";

const useArticles = (queryParams) => {
	const [articles, setArticles] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				const response = await ArticleService.getArticles(queryParams);
				setArticles(response.data);
			} catch (error) {
				if (error.response.status === 401) {
					AuthService.clearTokens();
					navigate("/login");
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchArticles();
	}, [navigate, queryParams]);

	return { articles, isLoading, setArticles };
};

export default useArticles;
