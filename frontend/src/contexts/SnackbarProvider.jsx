import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";
import CustomSnackbar from "../components/CustomSnackbar";

const SnackbarCtx = createContext();

export const SnackbarProvider = ({ children }) => {
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "info"
	});

	const showSnackbar = ({ message, severity = "info", duration = 3000 }) => {
		setSnackbar({
			open: true,
			message,
			severity,
			duration
		});
	};

	const closeSnackbar = () => {
		setSnackbar((prev) => ({ ...prev, open: false }));
	};
	const { open, message, severity } = snackbar;
	return (
		<SnackbarCtx.Provider value={{ showSnackbar }}>
			{children}
			<CustomSnackbar
				open={open}
				message={message}
				severity={severity}
				onClose={closeSnackbar}
			/>
		</SnackbarCtx.Provider>
	);
};

export const useSnackbar = () => useContext(SnackbarCtx);

SnackbarProvider.propTypes = {
	children: PropTypes.node.isRequired
};
