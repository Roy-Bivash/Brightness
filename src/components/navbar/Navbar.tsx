import NavbarCSS from "./Navbar.module.css";
import { Link } from "react-router-dom";
import HexagoneIcon from "../../assets/icons/hexagons.png";
import TriangleIcon from "../../assets/icons/triangle.png";


export function Navbar() {
    


    return (
        <div className={NavbarCSS.container}>
            <nav className={NavbarCSS.nav}>
                <ul className={NavbarCSS.ul}>
                    <li data-selected="true">
                        <Link to="/">
                            <img className={NavbarCSS.icons} src={TriangleIcon} alt="Home" />
                        </Link>
                    </li>
                    <li data-selected="false">
                        <Link to="#">
                            <img className={NavbarCSS.icons} src={HexagoneIcon} alt="Settings" />
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}