import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AuthService from "../api/authService";
import ArticleService from "../api/articleService";

const useReactions = (id) => {
	const [reactions, setReactions] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchReactions = async () => {
			try {
				const response = await ArticleService.getArticleReactions(id);
				setReactions(response.data);
			} catch (error) {
				if (error.response.status === 401) {
					AuthService.clearTokens();
					navigate("/login");
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchReactions();
	}, [navigate, id]);

	return { reactions, setReactions, isLoading, setIsLoading };
};

export default useReactions;
