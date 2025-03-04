// src/components/SideNav.jsx
import { NavLink } from "react-router-dom";
import { IoIosAddCircleOutline, IoMdPower } from "react-icons/io";
import { GoHome } from "react-icons/go";
import {Tooltip} from "@heroui/tooltip";
import logo from "../assets/logo-1.png"
import ThemeToggle from "./ThemeToggle";
import {useAuth} from "../context/AuthContext"
import { useUIState } from "../context/UIStateContext";



const SideNav = () => {
	const { logout, user } = useAuth();
	const { isInputFocused } = useUIState();

	// Add a class to hide the SideNav when search is focused on mobile
	const mobileHideClass = isInputFocused ? "md:flex hidden" : "flex";

  return (
    <div className={`h-14 md:h-screen w-full md:w-16 z-50 top-[91%] md:top-0 bg-white dark:bg-slate-900 md:border-y-0 md:border-l-0 border border-gray-300 md:border-r-[1px] dark:border-gray-700 fixed ${mobileHideClass} md:flex-col md:items-center py-0 md:py-10 rounded-xl md:rounded-none transition-all duration-300`}>
      <div className="flex justify-around md:flex-col items-center md:justify-center w-5/6 md:w-full">
		
		{/* LOGO */}
		<div className="mb-8 hidden md:block">
			<img
				src={logo}  // Update this path to your logo's location
				alt="Company Logo"
				className="w-12 h-12 object-contain"
			/>
		</div>

		{/* AVATAR */}
		
		{user ? (
			<Tooltip closeDelay={-1} key='avatar' placement="right" content={user.username}>
				<div className="avatar md:mb-8 ">
					<div className="w-10 md:w-12 h-10 md:h-12 rounded-full">
						<img src={`https://robohash.org/${user.username}?bgset=bg2`} alt="User Avatar" />
					</div>
				</div>
			</Tooltip>
		) : (
			<div className="avatar mb-8">
				<div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-slate-700" />
			</div>
		)}

		{/* NAVIGATION */}
        <ul className="space-y-0 md:space-y-10 flex justify-between md:flex-col md:justify-center md:items-center w-2/5 md:w-full">
			<Tooltip closeDelay={-1} key='home' placement="right" content="Home">
				<NavLink
					to="/"
					className={({ isActive }) =>
					`group rounded-lg w-12 h-12 flex justify-center items-center ${
						isActive ? "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-300" : "hover:bg-gray-200 dark:hover:bg-slate-700"
						}`
					} 
					
				>
						<li>
						<GoHome className="text-2xl group-hover:text-gray-700 dark:group-hover:text-gray-300" />
						</li>
				</NavLink>
			</Tooltip>

			<Tooltip closeDelay={-1} key='create' placement="right" content="Create Item">
				<NavLink
					to="/add-items"
					className={({ isActive }) =>
					`group rounded-lg w-12 h-12 flex justify-center items-center ${
						isActive ? "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-300" : "hover:bg-gray-200 dark:hover:bg-slate-700"
						}`
					}
				>
						<li>
							<IoIosAddCircleOutline className="text-2xl group-hover:text-gray-700 dark:group-hover:text-gray-300" />
						</li>
				</NavLink>
			</Tooltip>
		</ul>

		{/* THEME TOGGLE */}
		<div className="p-1  my-auto md:mt-8">
			<ThemeToggle />
		</div>
		
      </div>
		
		{/* LOGOUT */}
		<Tooltip closeDelay={-1} key='right' placement="right" content="Logout" >
			<button className="md:mt-[12rem] text-sm bg-red-400 border-[2px] md:border-[5px]  border-red-300 my-auto h-8 md:h-10 w-8 md:w-10 md:p-2 rounded-full text-red-800 mx-auto"  onClick={logout}>
				<IoMdPower className="mx-auto"/>

			</button>

		</Tooltip>
    </div>
  );
};

export default SideNav;
