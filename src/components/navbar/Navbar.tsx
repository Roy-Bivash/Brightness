import NavbarCSS from "./Navbar.module.css";
import { Link } from "react-router-dom";
import HexagoneIcon from "../../assets/icons/hexagons.png";
import TriangleIcon from "../../assets/icons/triangle.png";

interface NavbarProps {
    current: string;
}
export function Navbar({ current } : NavbarProps) {
    


    return (
        <div className={NavbarCSS.container}>
            <nav className={NavbarCSS.nav}>
                <ul className={NavbarCSS.ul}>
                    <li data-selected={(current == "Home")}>
                        <Link to="/">
                            <img className={NavbarCSS.icons} src={TriangleIcon} alt="Home" />
                        </Link>
                    </li>
                    <li data-selected={(current == "Setting")}>
                        <Link to="/setting">
                            <img className={NavbarCSS.icons} src={HexagoneIcon} alt="Setting" />
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}