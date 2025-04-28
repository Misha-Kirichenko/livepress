import { useContext } from "react";
import PropTypes from "prop-types";
import {
	Box,
	TextField,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Grid
} from "@mui/material";
import CategoriesContext from "../../contexts/CategoriesContext";

const ArticleFilters = ({ queryParamsData }) => {
	const categories = useContext(CategoriesContext);

	const { queryParams, handleSetParam } = queryParamsData;
	const { search, category_id } = queryParams;
	

	return (
		<Box sx={{ padding: 2, backgroundColor: "#f5f5f5", marginBottom: 3 }}>
			<Grid container spacing={2} justifyContent="space-between">
				<Grid item xs={12} sm={6} md={4}>
					<TextField
						fullWidth
						label="Search"
						variant="outlined"
						value={search}
						onChange={(e) => handleSetParam("search", e.target.value)}
						size="small"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<FormControl fullWidth size="small">
						<InputLabel>Category</InputLabel>
						<Select
							value={category_id}
							onChange={(e) => handleSetParam("category_id", e.target.value)}
							label="Category"
							displayEmpty
							fullWidth
						>
							<MenuItem value=""></MenuItem>
							{categories
								? categories.map((cat) => (
										<MenuItem key={cat.id} value={cat.id}>
											{cat.name}
										</MenuItem>
								  ))
								: ""}
						</Select>
					</FormControl>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					sx={{ display: "flex", justifyContent: "flex-end" }}
				></Grid>
			</Grid>
		</Box>
	);
};

ArticleFilters.propTypes = {
	queryParamsData: PropTypes.shape({
		queryParams: PropTypes.shape({
			search: PropTypes.string,
			category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		}),

		handleSetParam: PropTypes.func.isRequired
	}).isRequired
};

export default ArticleFilters;
