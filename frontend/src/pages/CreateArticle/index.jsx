import { useContext, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import ErrorPage from "../../components/ErrorPage";
import useCategories from "../../hooks/useCategories";
import { DEFAULT_IMG_URL } from "../../constants";
import ArticleForm from "../../components/ArticleForm";
import AuthService from "../../api/authService";
import { useNavigate } from "react-router";
import ArticleService from "../../api/articleService";
import hasVisibleText from "../../utils/hasVisibleText";

const CreateArticle = () => {
	const { role } = useContext(AuthContext);
	const navigate = useNavigate();
	const { categories } = useCategories();

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		imageFile: null,
		img: "",
		previewUrl: DEFAULT_IMG_URL
	});
	const initialValidationErrors = {
		title: "",
		description: "",
		category: "",
		img: ""
	};

	const [validationErrors, setValidationErrors] = useState(
		initialValidationErrors
	);

	if (role !== "ADMIN") return <ErrorPage status={403} />;

	const handleChangeArticleData = (field) => (e) => {
		const value = e.target?.value ?? e;
		if (validationErrors[field]) {
			setValidationErrors((prev) => {
				const newValidationErrorObj = {
					...prev,
					[field]: ""
				};
				return newValidationErrorObj;
			});
		}
		setFormData((prev) => ({
			...prev,
			[field]:
				field === "description" ? (hasVisibleText(value) ? value : "") : value
		}));
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

	const handleRemoveImage = () => {
		setFormData((prev) => ({
			...prev,
			imageFile: null,
			img: "",
			previewUrl: DEFAULT_IMG_URL,
			removeImage: true
		}));
	};

	const handleSave = async () => {
		try {
			const formDataObj = { ...formData };
			delete formDataObj.imageFile;
			delete formDataObj.img;
			delete formDataObj.removeImage;
			let hasErrors = false;
			for (const field in formDataObj) {
				if (!formDataObj[field]) {
					setValidationErrors((prev) => {
						const newValidationErrorObj = {
							...prev,
							[field]: `${field} can't be empty`
						};
						return newValidationErrorObj;
					});
					hasErrors = true;
				}
			}
			if (hasErrors) return;
			const {
				data: { id }
			} = await ArticleService.createArticle(formData);
			navigate(`/article/${id}`);
		} catch (error) {
			if (error.response?.status === 401) {
				AuthService.clearTokens();
				navigate("/login");
			} else if (error.response.status === 400) {
				const { errors } = error.response.data;
				setValidationErrors((prev) => {
					const newValidationErrorObj = { ...prev };
					for (const errorObj of errors) {
						const { path: field, msg } = errorObj;
						newValidationErrorObj[field] = msg;
					}
					return newValidationErrorObj;
				});
			} else if (error.response.status === 404) {
				setValidationErrors((prev) => {
					const newValidationErrorObj = {
						...prev,
						category: error.response.data.message
					};
					return newValidationErrorObj;
				});
			}
		}
	};

	return (
		<ArticleForm
			formData={formData}
			categories={categories}
			validationErrors={validationErrors}
			mode="create"
			articleDataHandlers={{
				handleChangeArticleData,
				handleImageChange,
				handleSave,
				handleRemoveImage
			}}
		/>
	);
};

export default CreateArticle;
