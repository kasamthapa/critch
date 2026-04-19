import { useLocation } from "react-router-dom";

export function Home() {
  const location = useLocation();
  const message = location.state?.message;
  return (
    <div>
      <h1>{message}</h1>Home
    </div>
  );
}

export default Home;
