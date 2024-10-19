function HomeHero() {
  return (
    <div className="relative">
      <div className="absolute inset-0">
        <img
          src="/images/heroHome.png"
          alt="Home Hero Image"
          className="h-[90vh] w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 h-[90vh] bg-black opacity-40"></div>
      <div className="relative flex h-screen select-none flex-col items-center justify-center text-center text-white">
        <h1 className="mb-4 text-3xl font-bold">Feng Shui & Koi Fish</h1>
        <h2 className="mb-2 text-6xl font-bold uppercase">
          Vitality & Prosperity
        </h2>
        <p className="mb-8 text-lg">
          Discover the secrets of raising Koi fish and creating the ideal feng
          shui space for your home.
        </p>
      </div>
    </div>
  )
}
export default HomeHero
