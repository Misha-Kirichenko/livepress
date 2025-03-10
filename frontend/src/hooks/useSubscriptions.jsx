import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import CategoryService from "../api/categoryService";
import AuthService from "../api/authService";

const useSubscriptions = () => {
	const [subscriptions, setSubscriptions] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchSubscriptions = async () => {
			try {
				const response = await CategoryService.getUserSubscriptions();
				setSubscriptions(response.data);
			} catch (error) {
				if (error.response.status === 401) {
					AuthService.clearTokens();
					navigate("/login");
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchSubscriptions();
	}, [navigate]);

	return { subscriptions, isLoading };
};

export default useSubscriptions;
