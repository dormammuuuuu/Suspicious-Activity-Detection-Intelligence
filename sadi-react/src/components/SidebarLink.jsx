import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

const SidebarLink = (props) => {
    const link = props.link;
    const label = props.label;
    const children = props.children;

    return (
        <NavLink to={link}
            className={({ isActive }) => clsx(
                "flex items-center p-2 text-base font-normal rounded-lg hover:bg-sblue-alt hover:text-sblue",
                isActive ? "text-sblue bg-sblue-alt" : " text-sgray-300"
            )}>
            {children}
            <span className="ml-3 text-lg">{label}</span>
        </NavLink>
    )
}

export default SidebarLink