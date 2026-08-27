import { useState } from "react";
import LoginPopup from "./LoginPopup.jsx";


const Navbar = () => {
    const [showPopUp, setShowPopUp] = useState(false);
    const [user, setUser] = useState(true);

    return (
        <>
            <nav className="h-[82px] border-b border-[#D8CFBC]/10 px-[7%] flex items-center justify-between">

                {/* Logo */}
                <div className="text-[21px] font-medium tracking-[-0.5px] text-[#FFFBF4]">
                    <span className="font-semibold text-[#D8CFBC]">AI</span>{" "}
                    Agent
                </div>

                {/* Login */}
                {
                    user && <button
                        onClick={() => setShowPopUp(true)}
                        className="
            rounded-full
            border border-[#D8CFBC]/35
            bg-transparent
            px-[22px]
            py-[10px]
            text-sm
            text-[#FFFBF4]
            transition-all
            duration-300
            hover:bg-[#D8CFBC]
            hover:text-[#11120D]
          "
                    >
                        Login
                    </button>
                }

            </nav>

            {/* Pop-Up show  */}
            {showPopUp &&
                <LoginPopup onClose={() => setShowPopUp(false)} />}
        </>
    );
};

export default Navbar;