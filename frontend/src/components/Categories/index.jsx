import PropTypes from "prop-types";
import { Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useContext } from "react";
import CategoriesContext from "../../contexts/CategoriesContext";

const Categories = ({
	isLoadingCats,
	isLoadingSubs,
	subscriptions,
	handleToggleSubscription
}) => {
	const categories = useContext(CategoriesContext);

	if (!categories || isLoadingSubs || isLoadingCats) {
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

Categories.propTypes = {
	isLoadingCats: PropTypes.bool.isRequired,
	isLoadingSubs: PropTypes.bool.isRequired,
	subscriptions: PropTypes.array.isRequired,
	handleToggleSubscription: PropTypes.func.isRequired
};

export default Categories;
