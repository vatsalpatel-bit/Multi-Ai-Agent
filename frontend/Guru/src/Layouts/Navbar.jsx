import { useState } from "react";
import LoginPopup from "./LoginPopup.jsx";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);

  const user = useSelector((state) => state.user.user);

  return (
    <>
      <nav className="flex h-[82px] items-center justify-between  border-[#D8CFBC]/10 px-[5%]">

        {/* Logo */}
        <div className="text-[21px] font-medium text-[#FFFBF4]">
          <span className="font-semibold text-[#D8CFBC]">
            AI
          </span>{" "}
          Agent
        </div>

        {/* Login */}
        {!user && (
          <button
            onClick={() => setShowLogin(true)}
            className="
              rounded-full
              border border-[#D8CFBC]/35
              px-[22px] py-[10px]
              text-sm
              text-[#FFFBF4]
              transition
              hover:bg-[#D8CFBC]
              hover:text-[#11120D]
            "
          >
            Login
          </button>
        )}

      </nav>

      {/* Login Popup */}
      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
};

export default Navbar;