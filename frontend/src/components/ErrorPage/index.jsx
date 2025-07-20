import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import GoHome from "../GoHome";

const ErrorPage = ({ status, text }) => {
	const statusText =
		status === 404
			? !text
				? "Page was not found"
				: `${text} was not found`
			: status === 403 && !text
			? "You have no access rights"
			: text;

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
				{status}
			</Typography>
			<Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
				{statusText}
			</Typography>
			<GoHome />
		</Box>
	);
};

ErrorPage.propTypes = {
	text: PropTypes.string,
	status: PropTypes.number.isRequired
};
export default ErrorPage;
