import CommentService from "../api/commentService";

export const refetchCommentsAfterDelete = async (
	setComments,
	page,
	limit,
	article_id
) => {
	const {
		data: { data, total }
	} = await CommentService.getArticlesComments(article_id, {
		page,
		limit
	});

	console.log("total", total);

	setComments((prev) => ({
		data: page === 1 ? data : [...prev.data, ...data],
		total
	}));
};
