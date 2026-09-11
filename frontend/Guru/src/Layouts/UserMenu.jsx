const UserMenu = ({ user, onLogout }) => {
  return (
    <div
      className="
        absolute
        bottom-[82px]
        left-2
        right-2
        rounded-[22px]
        border
        border-[#D8CFBC]/10
        bg-[#3A3937]
        p-4
        shadow-[0_15px_40px_rgba(0,0,0,0.45)]
      "
    >

      {/* User Header */}
      <button className="flex w-full items-center gap-3 px-2 py-2">

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#F28B82]
            text-xs
            font-medium
            text-white
          "
        >
          {user?.name
            ? user.name.slice(0, 2).toUpperCase()
            : "VP"}
        </div>

        <div className="min-w-0 flex-1 text-left">

          <p className="truncate text-sm font-medium text-[#FFFBF4]">
            {user?.name || "vatsal patel"}
          </p>
          
        </div>

        <span className="text-xl text-[#D8CFBC]">
          ›
        </span>

      </button>

      {/* Divider */}
      <div className="my-3 h-px bg-[#D8CFBC]/15" />


      {/* Logout */}
      <button
        onClick={onLogout}
        className="
          menu-item
          text-[#FFFBF4]
          hover:bg-[#565449]/50
        "
      >
        <span className="menu-icon">↪</span>
        Log out
      </button>

    </div>
  );
};

export default UserMenu;