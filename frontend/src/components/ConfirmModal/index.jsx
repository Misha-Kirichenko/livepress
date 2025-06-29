import {
	Modal,
	Box,
	Typography,
	Button,
	Stack,
	Fade,
	Backdrop
} from "@mui/material";
import PropTypes from "prop-types";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	borderRadius: 2,
	boxShadow: 24,
	p: 4,
	width: 400,
	maxWidth: "90%"
};

const ConfirmModal = ({
	open,
	onClose,
	onConfirm,
	message = "Are you sure you want to proceed?"
}) => {
	return (
		<Modal
			open={open}
			onClose={onClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 300,
				sx: {
					backgroundColor: "rgba(0, 0, 0, 0.2)"
				}
			}}
		>
			<Fade in={open}>
				<Box sx={style}>
					<Typography
						variant="h6"
						gutterBottom
						dangerouslySetInnerHTML={{ __html: message }}
					/>

					<Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
						<Button
							variant="outlined"
							color="primary"
							onClick={() => onClose(false)}
						>
							Cancel
						</Button>
						<Button variant="contained" color="primary" onClick={onConfirm}>
							Yes
						</Button>
					</Stack>
				</Box>
			</Fade>
		</Modal>
	);
};

ConfirmModal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired,
	message: PropTypes.string
};

export default ConfirmModal;
