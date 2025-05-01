import { useEffect, useState } from "react";
import CategoryService from "../../api/categoryService";
import useSubscriptions from "../../hooks/useSubscriptions";
import ArticleList from "../Articlelist";
import Categories from "../Categories";
import useCategories from "../../hooks/useCategories";
import CategoriesContext from "../../contexts/CategoriesContext";

const UserContent = () => {
	const { subscriptions: initialSubscriptions } =
		useSubscriptions();
	const { categories} = useCategories();
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

	return (
		<CategoriesContext.Provider value={categories}>
			<Categories
				subscriptions={subscriptions}
				setSubscriptions={setSubscriptions}
				handleToggleSubscription={handleToggleSubscription}
			/>

			<ArticleList />
		</CategoriesContext.Provider>
	);
};

export default UserContent;
