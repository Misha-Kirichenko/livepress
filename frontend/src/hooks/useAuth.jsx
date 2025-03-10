import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AuthService from "../api/authService";

const useAuth = () => {
	const [userData, setUserData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const user = await AuthService.me();
				setUserData(user);
			} catch (error) {
				if (error.response.status === 401) {
					AuthService.clearTokens();
					navigate("/login");
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchUser();
	}, [navigate]);

	return { userData, isLoading };
};

export default useAuth;
