import { useContext, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import ErrorPage from "../../components/ErrorPage";
import useCategories from "../../hooks/useCategories";
import { DEFAULT_IMG_URL } from "../../constants";
import "react-quill/dist/quill.snow.css";
import ArticleForm from "../../components/ArticleForm";

const CreateArticle = () => {
	const { role } = useContext(AuthContext);
	const { categories } = useCategories();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		imageFile: null,
		img: "",
		previewUrl: DEFAULT_IMG_URL
	});

	if (role !== "ADMIN") return <ErrorPage status={403} />;

	const handleChangeArticleData = (field) => (e) => {
		const value = e.target?.value ?? e;
		setFormData((prev) => ({
			...prev,
			[field]: value
		}));
	};

	const handleChangeDesc = (value) => {
		setFormData((prev) => ({ ...prev, description: value }));
	};

	const handleImageChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData((prev) => ({
				...prev,
				imageFile: file,
				previewUrl: URL.createObjectURL(file)
			}));
		}
	};

	return (
		<ArticleForm
			formData={formData}
			categories={categories}
			mode="create"
			articleDataHandlers={{
				handleChangeArticleData,
				handleChangeDesc,
				handleImageChange
			}}
		/>
	);
};

export default CreateArticle;
