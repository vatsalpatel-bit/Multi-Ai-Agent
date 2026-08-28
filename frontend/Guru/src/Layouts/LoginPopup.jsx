import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../Services/utils/firebase";
import api from "../Services/utils/axios.js";

const LoginPopup = ({ onClose }) => {

  const loginApi = async (token) => {
    const res = await api.post("/api/v1/auth/login", { token })
    return res.data;
  }
  const googleAuthentication = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    const res = await loginApi(token);
    console.log(res);
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#11120D]/80 px-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="
          relative
          w-full
          max-w-[420px]
          rounded-[28px]
          border border-[#D8CFBC]/10
          bg-[#11120D]
          p-8
          shadow-[0_25px_80px_rgba(0,0,0,0.55)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="
            absolute
            right-5
            top-5
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            text-[#D8CFBC]/60
            transition
            hover:bg-[#565449]/40
            hover:text-[#FFFBF4]
          "
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="mb-5 text-[22px] font-medium text-[#FFFBF4]">
            <span className="font-semibold text-[#D8CFBC]">AI</span>{" "}
            Agent
          </div>

          <h2 className="font-serif text-3xl font-medium text-[#FFFBF4]">
            Welcome back
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#D8CFBC]/60">
            Sign in to continue using your AI agent.
          </p>
        </div>

        {/* Google Login */}
        <button
          onClick={googleAuthentication}
          className="
            mt-8
            flex
            h-[54px]
            w-full
            items-center
            justify-center
            gap-3
            rounded-[15px]
            border
            border-[#D8CFBC]/20
            bg-[#FFFBF4]
            font-medium
            text-[#11120D]
            transition-all
            duration-300
            hover:bg-[#D8CFBC]
          "
        >
          {/* Google Icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fill="#4285F4"
              d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.4Z"
            />
            <path
              fill="#34A853"
              d="M12 21.75c2.63 0 4.84-.87 6.45-2.35l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.75 9.75 0 0 0 12 21.75Z"
            />
            <path
              fill="#FBBC05"
              d="M6.54 13.85A5.86 5.86 0 0 1 6.23 12c0-.64.11-1.26.31-1.85V7.63H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.37l3.24-2.52Z"
            />
            <path
              fill="#EA4335"
              d="M12 6.12c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.22 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.7 5.38l3.24 2.52C7.31 7.84 9.46 6.12 12 6.12Z"
            />
          </svg>

          Continue with Google
        </button>

        <p className="mt-6 text-center text-[11px] leading-5 text-[#D8CFBC]/40">
          By continuing, you agree to our Terms of Service
          and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default LoginPopup;