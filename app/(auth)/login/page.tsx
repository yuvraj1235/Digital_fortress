export default function RegisterPage() {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/regn.webp')",
      }}
    >
      {/* Global overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Card */}
      <div
        className="relative z-10 w-[90%] max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-white/10"
        style={{
          backgroundImage: "url('/rock.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Card dark overlay */}
        <div className="absolute inset-0 bg-[#1a1222]/80 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative px-10 py-8">
          {/* Title */}
          <h2 className="text-center text-4xl font-extrabold text-white mb-8 tracking-wider">
            START YOUR JOURNEY
          </h2>

          {/* Form */}
          <form className="space-y-5">
            <input
              type="email"
              placeholder="EMAIL"
              className="w-full rounded-xl bg-black/40 px-5 py-3 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              type="text"
              placeholder="USERNAME"
              className="w-full rounded-xl bg-black/40 px-5 py-3 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              type="password"
              placeholder="PASSWORD"
              className="w-full rounded-xl bg-black/40 px-5 py-3 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* Login */}
            <p className="text-center text-sm text-white/80">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-purple-300 hover:underline"
              >
                LOGIN
              </a>
            </p>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-black/50 py-3 text-lg font-bold tracking-widest text-white shadow-lg hover:bg-black/70 transition"
            >
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
