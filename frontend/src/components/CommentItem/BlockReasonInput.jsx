import { Box, Button, Popover, TextField, Typography } from "@mui/material";

const BlockReasonInput = () => {
	return (
		<Popover
			open={open}
			anchorEl={anchorEl}
			onClose={handleClosePopover}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "center"
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "center"
			}}
		>
			<Box
				sx={{
					p: 2,
					display: "flex",
					flexDirection: "column",
					gap: 1,
					minWidth: 220
				}}
			>
				<TextField
					label="Block reason"
					value={reason}
					onChange={(e) => handleSetReason(e.target.value)}
					size="small"
					multiline
					rows={1}
					autoFocus
				/>

				<Typography color="error" variant="span">
					{error ? error : ""}
				</Typography>
				<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
					<Button variant="outlined" size="small" onClick={handleClosePopover}>
						Cancel
					</Button>
					<Button variant="contained" size="small" onClick={handleConfirmBlock}>
						OK
					</Button>
				</Box>
			</Box>
		</Popover>
	);
};
