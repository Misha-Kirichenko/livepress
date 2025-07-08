export const handleSetCommentsAfterDelete = (setComments, id) => {
	setComments((prevComments) => ({
		data: prevComments.data.filter((comment) => comment.id !== id),
		total: prevComments.total - 1
	}));
};
