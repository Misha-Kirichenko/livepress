import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import CategoryService from "../api/categoryService";
import AuthService from "../api/authService";

const useCategories = () => {
	const [categories, setCategories] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await CategoryService.getAllCategories();
				setCategories(response.data);
			} catch (error) {
				if (error.response?.status === 401) {
					AuthService.clearTokens();
					navigate("/login");
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchCategories();
	}, [navigate]);

	return { categories, isLoading };
};

export default useCategories;
