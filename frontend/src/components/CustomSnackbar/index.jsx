import PropTypes from "prop-types";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { forwardRef } from "react";

const Alert = forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackbar = ({
	open,
	onClose,
	message,
	severity = "info",
	duration = 3000
}) => {
	return (
		<Snackbar
			open={open}
			autoHideDuration={duration}
			onClose={onClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
		>
			<Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
				{message}
			</Alert>
		</Snackbar>
	);
};

CustomSnackbar.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	message: PropTypes.string.isRequired,
	severity: PropTypes.oneOf(["success", "error", "warning", "info"]),
	duration: PropTypes.number
};

export default CustomSnackbar;
