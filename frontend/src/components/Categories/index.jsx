import { useState, useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import useSubscriptions from "../../hooks/useSubscriptions";
import useCategories from "../../hooks/useCategories";
import CategoryService from "../../api/categoryService";

const Categories = () => {
	const { subscriptions: initialSubscriptions, isLoading: isLoadingSubs } =
		useSubscriptions();
	const { categories, isLoading: isLoadingCats } = useCategories();
	const [subscriptions, setSubscriptions] = useState(
		initialSubscriptions || []
	);

	useEffect(() => {
		if (initialSubscriptions) {
			setSubscriptions(initialSubscriptions);
		}
	}, [initialSubscriptions]);

	const handleToggleSubscription = async (categoryId) => {
		try {
			const response = await CategoryService.toggleSubscription(categoryId);
			const updatedSubscriptions = response.data;
			if (Array.isArray(updatedSubscriptions)) {
				setSubscriptions(updatedSubscriptions);
			}
		} catch (error) {
			console.error("subscription toggle error:", error);
		}
	};

	if (isLoadingSubs || isLoadingCats) {
		return "Loading...";
	}

	const markedCategories = categories?.map((category) => {
		const isSubscribed =
			Array.isArray(subscriptions) &&
			subscriptions.some((ctg) => ctg.category_id === category.id);

		return (
			<Button
				key={category.id}
				variant={isSubscribed ? "contained" : "outlined"}
				onClick={() => handleToggleSubscription(category.id)}
			>
				{category.name}
			</Button>
		);
	});

	return (
		<>
			<Typography
				variant="h3"
				component="h3"
				sx={{ marginBottom: "50px", textAlign: "center" }}
			>
				Subscribed to
			</Typography>
			<Stack
				spacing={2}
				direction="row"
				flexWrap="wrap"
				gap={2}
				justifyContent="center"
			>
				{markedCategories}
			</Stack>
		</>
	);
};

export default Categories;
