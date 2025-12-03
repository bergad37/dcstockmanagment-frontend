import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <Link to="/login">
        <p>Go to Sign in page</p>
      </Link>
    </div>
  );
};

export default Home;
