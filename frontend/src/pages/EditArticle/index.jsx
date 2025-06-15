import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import AuthContext from "../../contexts/AuthContext";
import ErrorPage from "../../components/ErrorPage";
import useArticle from "../../hooks/useArticle";
import Loader from "../../components/Loader";
import useCategories from "../../hooks/useCategories";
import { API_HOST, DEFAULT_IMG_URL } from "../../constants";
import "react-quill/dist/quill.snow.css";
import ArticleForm from "../../components/ArticleForm";
import ArticleService from "../../api/articleService";
import AuthService from "../../api/authService";
import hasVisibleText from "../../utils/hasVisibleText";

const EditArticle = () => {
	const navigate = useNavigate();
	const initialFormDataRef = useRef(null);

	const initialFormData = {
		title: "",
		description: "",
		category: "",
		imageFile: null,
		img: "",
		previewUrl: DEFAULT_IMG_URL,
		removeImage: false
	};

	const initialValidationErrors = {
		title: "",
		description: "",
		category: "",
		img: ""
	};

	const { id: article_id } = useParams();
	const { id: author_id } = useContext(AuthContext);
	const { categories } = useCategories();
	const { article, isLoading: isArticleLoading } = useArticle(article_id);

	const [validationErrors, setValidationErrors] = useState(
		initialValidationErrors
	);

	const [formData, setFormData] = useState(initialFormData);

	const isFormChanged = () => {
		return (
			JSON.stringify(formData) !== JSON.stringify(initialFormDataRef.current)
		);
	};

	useEffect(() => {
		if (article) {
			const initialData = {
				title: article.title || "",
				description: article.description || "",
				category:
					categories?.find((c) => c.name === article.category)?.id || "",
				imageFile: null,
				img: article.img || "",
				previewUrl: article.img
					? `${API_HOST}/${article.img}`
					: DEFAULT_IMG_URL,
				removeImage: false
			};
			setFormData(initialData);
			initialFormDataRef.current = initialData;
		}
	}, [article, categories]);

	if (isArticleLoading) return <Loader type="block" width="250" height="250" />;
	if (!article) return <ErrorPage text="Article" status={404} />;
	if (author_id !== article.author.author_id) return <ErrorPage status={403} />;

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
			const formChanged = isFormChanged();
			if (formChanged) {
				await ArticleService.updateArticle(article_id, formData);
			}
			navigate(`/article/${article_id}`);
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

	const handleImageChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData((prev) => ({
				...prev,
				imageFile: file,
				previewUrl: URL.createObjectURL(file),
				removeImage: false
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

	return (
		<ArticleForm
			formData={formData}
			categories={categories}
			validationErrors={validationErrors}
			mode="edit"
			articleDataHandlers={{
				handleChangeArticleData,
				handleImageChange,
				handleSave,
				handleRemoveImage
			}}
		/>
	);
};

export default EditArticle;
