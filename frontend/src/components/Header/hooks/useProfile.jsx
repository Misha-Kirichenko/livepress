import { useState, useEffect } from "react";
import ProfileService from "../../../api/profileService";

const useProfile = () => {
	const [profileData, setProfileData] = useState(null);
	const [profileIsLoading, setProfileIsLoading] = useState(true);

	useEffect(() => {
		const fetchProfile = async () => {
			setProfileIsLoading(true);
			try {
				const profile = await ProfileService.getProfile();
				setProfileData(profile);
			} catch (error) {
				console.error("profile load error:", error);
			} finally {
				setProfileIsLoading(false);
			}
		};

		fetchProfile();
	}, []);

	return { profileData, profileIsLoading };
};

export default useProfile;
