export const handleSetNewComment = (setComments, createdComment, limit) => {
	setComments((prev) => {
		const updatedData = [createdComment, ...prev.data];
		if (updatedData.length > limit) {
			updatedData.pop();
		}
		return { data: updatedData, total: prev.total + 1 };
	});
};
