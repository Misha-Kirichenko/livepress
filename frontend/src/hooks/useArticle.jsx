import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AuthService from "../api/authService";
import ArticleService from "../api/articleService";

const useArticle = (id) => {
	const [article, setArticle] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchArticle = async () => {
			try {
				const response = await ArticleService.getArticle(id);
				setArticle(response.data);
			} catch (error) {
				if (error.response.status === 401) {
					AuthService.clearTokens();
					navigate("/login");
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchArticle();
	}, [navigate, id]);

	return { article, isLoading };
};

export default useArticle;
