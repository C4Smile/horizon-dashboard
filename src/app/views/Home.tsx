import { Counters, WelcomeBanner } from "partials";

/**
 * Home
 * @returns Home page component
 */
function Home() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <WelcomeBanner />
      <Counters />
    </div>
  );
}

export default Home;
