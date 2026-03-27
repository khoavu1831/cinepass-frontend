import SubNav from "./SubNav"
import { Link } from "react-router-dom";

function NavItem({ label, href, data, col, activeNav, setActiveNav, variant = "desktop", responsive }) {
  const isOpen = activeNav === label;

  const toggle = () => {
    if (data) {
      setActiveNav(isOpen ? null : label);
    }
  };

  return (
    <div className={`relative cursor-pointer ${variant === "mobile" ? "p-2 text-[13px]" : ""}`}>
      <Link
        to={"/search"}
        className={`hover:text-mainblue ${variant === "mobile" ? "text-white" : " "}`}
        href={href}
        onClick={toggle}>
        {label}
        {data && <i className="fa-solid fa-caret-down ml-1"></i>}
      </Link>

      {data && <SubNav data={data} isOpen={isOpen} col={col} responsive={responsive} />}
    </div>
  )
}

export default NavItem