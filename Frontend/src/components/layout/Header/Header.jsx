import AdHeader from "../ad-header/AdHeader";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

function Header(){


    return(
        <>
        <AdHeader/>
        <nav className="w-screen h-16 bg-[#94A3B8] flex items-center justify-between px-4 md:px-6 lg:px-10">
            <div className="">
                <p>Ecommerce</p>
            </div>
            <ul className="hidden md:flex items-center gap-6 md:gap-8 lg:gap-10">
                <li className="text-xl font-medium hover:text-gray-700 cursor-pointer"><Link to="/">Home</Link></li>
                <li className="text-xl font-medium hover:text-gray-700 cursor-pointer"><Link to="/shop">Shop</Link></li>
                <li className="text-xl font-medium hover:text-gray-700 cursor-pointer"><Link to="/about">About</Link></li>
                <li className="text-xl font-medium hover:text-gray-700 cursor-pointer"><Link to="/contact">Contact</Link></li>
            </ul>
            <div className="flex items-center gap-5 md:gap-8 lg:gap-10">
                <div className="">
                    <IoSearch className="text-2xl"/>
                </div>
                <div className="w-10 h-10 relative flex items-center justify-center">
                    <FaCartShopping className="text-2xl"/>
                    <div className="w-5 h-5 bg-red-500 text-white absolute top-[-1px] right-[-5px] rounded-full flex items-center justify-center">0</div>
                </div>
                <div className="md:hidden">
                    <GiHamburgerMenu className="text-2xl"/>
                </div>
                <div className="hidden w-10 h-10 relative md:flex items-center justify-center">
                    <FaHeart className="text-2xl"/>
                    <div className="w-5 h-5 bg-red-500 text-white absolute top-[-1px] right-[-5px] rounded-full flex items-center justify-center">0</div>
                </div>
            </div>
        </nav>
        </>
    )

}

export default Header;