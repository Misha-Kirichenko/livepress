import { Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { useNavigate } from "react-router";

const GoHome = () => {
	const navigate = useNavigate();

	const handleGoHome = () => {
		navigate("/");
	};

	return (
		<Button variant="contained" onClick={handleGoHome}>
			<HomeIcon />
			&nbsp;
			<KeyboardReturnIcon />
		</Button>
	);
};

export default GoHome;
