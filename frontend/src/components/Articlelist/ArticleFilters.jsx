import { useContext, useEffect, useRef, useState } from "react";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PropTypes from "prop-types";
import {
	Box,
	TextField,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Grid,
	Button
} from "@mui/material";
import CategoriesContext from "../../contexts/CategoriesContext";
import AuthContext from "../../contexts/AuthContext";
import { Link } from "react-router";

const ArticleFilters = ({ queryParamsData }) => {
	const categories = useContext(CategoriesContext);
	const { role } = useContext(AuthContext);
	const { queryParams, handleSetParam } = queryParamsData;
	const { search, category_id } = queryParams;

	const [searchStr, setSearchStr] = useState(search);
	const debounceTimeout = useRef(null);

	const handleSetSearch = ({ target }) => {
		const { value } = target;
		setSearchStr(value);

		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current);
		}

		debounceTimeout.current = setTimeout(() => {
			if (!value.length || value.length > 3) {
				handleSetParam("search", value);
			}
		}, 500);
	};

	useEffect(() => {
		return () => {
			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}
		};
	}, []);

	return (
		<Box sx={{ padding: 2, backgroundColor: "#f5f5f5", marginBottom: 3 }}>
			<Grid container spacing={2} justifyContent="space-between">
				<Grid item xs={12} sm={6} md={4}>
					<TextField
						fullWidth
						label="Search"
						variant="outlined"
						value={searchStr}
						onChange={handleSetSearch}
						size="small"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					<FormControl fullWidth size="small">
						<InputLabel>Category</InputLabel>
						<Select
							value={category_id}
							onChange={(e) =>
								handleSetParam("category_id", String(e.target.value))
							}
							label="Category"
							displayEmpty
							fullWidth
						>
							<MenuItem value=""></MenuItem>
							{categories &&
								categories.map((cat, index) => (
									<MenuItem key={`${cat.id}-${index}`} value={cat.id}>
										{cat.name}
									</MenuItem>
								))}
						</Select>
					</FormControl>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					sx={{
						display: "flex",
						justifyContent: "flex-end",
						alignItems: "flex-start"
					}}
				>
					{role === "ADMIN" && (
						<Link to="/article/create" style={{ textDecoration: "none" }}>
							<Button
								variant="contained"
								startIcon={<PostAddIcon />}
								color="primary"
							>
								Create New Article
							</Button>
						</Link>
					)}
				</Grid>
			</Grid>
		</Box>
	);
};

ArticleFilters.propTypes = {
	queryParamsData: PropTypes.shape({
		queryParams: PropTypes.shape({
			search: PropTypes.string,
			category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		}),
		handleSetParam: PropTypes.func.isRequired
	}).isRequired
};

export default ArticleFilters;
