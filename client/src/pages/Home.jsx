import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useUIState } from "../context/UIStateContext";


const Home = () => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const { toggleInputFocus } = useUIState();

	// Fetch items with optional search and pagination
	const fetchItems = async (page = 1, search = "") => {
		setLoading(true);
		try {
			const response = await axios.get("/api/v1/item", {
				params: { page, search },
			});
			setItems(response.data.data);
			setCurrentPage(response.data.currentPage);
			setTotalPages(response.data.totalPages);
		} catch (error) {
			console.log("Error fetching items:", error);
		} finally {
			setLoading(false);
		}
	};

	// Fetch items on component mount
	useEffect(() => {
		fetchItems();
	}, []);

	// Reload data when search field is cleared
	useEffect(() => {
		if (searchTerm === "") {
			fetchItems();
		}
	}, [searchTerm]);

	// Handle search
	const handleSearch = () => {
		setCurrentPage(1); // Reset to first page when searching
		fetchItems(1, searchTerm);
	};

	// Handle pagination
	const handlePageChange = (newPage) => {
		if (newPage > 0 && newPage <= totalPages) {
			fetchItems(newPage, searchTerm);
		}
	};

	return (
		<div>
				{/* HERO IMAGE */}
				<div className="bg-hero-img w-full h-[40vh] bg-cover bg-center"></div>

				{/* SEARCH FORM */}
				<div className="min-h-[10vh] bg-[#f7f7f7] dark:bg-slate-900 py-2">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSearch(); // Call the existing handleSearch function
						}}
						className="flex justify-center items-center space-x-2"
					>
						<input
							type="text"
							placeholder="Search by name or description..."
							className="input border-blue-400 focus:outline-none focus:ring-0 w-4/5 md:w-2/5 "
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onFocus={() => toggleInputFocus(true)}
							onBlur={() => toggleInputFocus(false)}
													
							/>

						<button type="submit" className="btn btn-sm btn-circle border-blue-400 hover:border-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 group"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-blue-500"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
							>
								<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 13l4 4L19 7"
								/>
							</svg>
						</button>

					</form>
					
				</div>

				{/* TABLE */}

				<div className="overflow-x-auto bg-[repeating-linear-gradient(45deg,var(--fallback-b1,oklch(var(--b1))),var(--fallback-b1,oklch(var(--b1)))_13px,var(--fallback-b2,oklch(var(--b2)))_13px,var(--fallback-b2,oklch(var(--b2)))_14px)]">
					


					<table className="mx-auto table table-zebra">
						
						{/* head */}
						<thead className="bg-slate-300 dark:bg-slate-800 text-center md:text-left">
						<tr className="text-xl">
							<th className="font-medium text-blue-500">NAME</th>
							<th className="font-medium text-blue-500">DESCRIPTION</th>
						</tr>
						</thead>

						{/* body */}
						<tbody className="text-center md:text-left">
						{loading ? (
							<tr>
								<td colSpan="2" className="text-center">
									<span className="loading loading-spinner loading-lg text-blue-500"></span>
								</td>
							</tr>
						) : items.length > 0 ? (
							items.map((item) => (
								<tr key={item._id} className="text-base">
									<td  className="whitespace-nowrap">{item.name}</td>
									<td  className="whitespace-nowrap">{item.description}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="2" className="text-center">
									No items found. Go to the create item page to add you items.
								</td>
							</tr>
						)}
						</tbody>
					</table>

				</div>
					
				{/* Pagination Controls */}
			<div className="flex justify-center items-center my-4 space-x-4 mb-20 md:mb-2">
				<button
					className="btn btn-sm"
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Previous
				</button>
				<span className="text-sm">
					Page {currentPage} of {totalPages}
				</span>
				<button
					className="btn btn-sm"
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>

	</div>
	);
}

export default Home;
