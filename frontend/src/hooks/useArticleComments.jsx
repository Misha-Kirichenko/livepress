import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import AuthService from "../api/authService";
import CommentService from "../api/commentService";

const useArticleComments = (articleId, limit = 5) => {
	const [comments, setComments] = useState({ data: [], total: 0 });
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const navigate = useNavigate();

	const fetchComments = useCallback(
		async (pageNum) => {
			try {
				const response = await CommentService.getArticlesComments(articleId, {
					page: pageNum,
					limit
				});

				const newComments = response.data;

				setComments((prev) => ({
					data:
						pageNum === 1
							? newComments.data
							: [...prev.data, ...newComments.data],
					total: newComments.total
				}));

				setPage(pageNum);
			} catch (error) {
				if (error?.response?.status === 401) {
					AuthService.clearTokens();
					navigate("/login");
				}
			}
		},
		[articleId, limit, navigate]
	);

	useEffect(() => {
		const loadInitial = async () => {
			setIsLoading(true);
			await fetchComments(1);
			setIsLoading(false);
		};

		loadInitial();
	}, [fetchComments]);

	const loadMore = async () => {
		if (isLoadingMore || comments.data.length >= comments.total) return;

		setIsLoadingMore(true);
		await fetchComments(page + 1);
		setIsLoadingMore(false);
	};

	const hasMore =
		Boolean(comments.total) && comments.data.length < comments.total;


	return {
		comments,
		isLoading,
		isLoadingMore,
		loadMore,
		setComments,
		hasMore
	};
};

export default useArticleComments;
