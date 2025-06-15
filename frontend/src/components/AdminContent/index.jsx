import CategoriesContext from "../../contexts/CategoriesContext";
import useCategories from "../../hooks/useCategories";
import ArticleList from "../Articlelist";
import Header from "../Header";

const AdminContent = () => {
	const { categories } = useCategories();
	return (
		<CategoriesContext.Provider value={categories}>
			<Header />
			<ArticleList />
		</CategoriesContext.Provider>
	);
};

export default AdminContent;
