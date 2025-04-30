import PropTypes from "prop-types";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";

const NotFound = ({ text }) => {
	const navigate = useNavigate();

	const handleGoHome = () => {
		navigate("/");
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
				px: 2
			}}
		>
			<Typography variant="h1" color="primary" fontWeight="bold">
				404
			</Typography>
			<Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
				{!text ? "Page was not found" : `${text} was not found`}
			</Typography>
			<Button variant="contained" onClick={handleGoHome}>
				Go to homepage
			</Button>
		</Box>
	);
};

NotFound.propTypes = {
	text: PropTypes.string
};
export default NotFound;
