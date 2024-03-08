import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logoutThunk } from "../../redux/thunk/auth-thunk";


const menuItems = [
    {
      title: "Calendar",
      path: "/calendar",
    },
    {
      title: "Staffs",
      path: "/staffs",
    },
    {
      title: "Models",
      path: "/models",
    },
    {
      title: "Bookings",
      path: "/booking",
    },
  ];

export default function NavBar() {
    const { staff } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch()

    function renderMenuItems() {
      return menuItems.map((item) => {
        return (
          <li key={item.path} className="text-slate-400 hover:text-slate-600">
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? "text-slate-700" : "")}
            >
              {item.title}
            </NavLink>
          </li>
        );
      });
    }

    function handleLogout() {
        dispatch(logoutThunk())
    }

  return (
    <div className="w-screen border-b border-b-slate-200">
    <div className="flex items-center max-w-[700px]  py-4 px-2 mx-auto">
          <h1 className="grow-0 font-bold text-slate-900">J.I.M.</h1>
          <nav className="grow px-4 pl-6">
            <ul className="flex gap-6">{renderMenuItems()}</ul>
          </nav>
          <div className="flex gap-3 items-center">
            <h2 className="">Hi <span className="font-bold">{staff?.firstName}</span></h2>
            <DropdownMenu>
                <DropdownMenuTrigger><ChevronDown /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <p>Settings</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                        <p>Logout</p>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
  )
}
