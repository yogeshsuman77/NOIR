import { useNavigate } from "react-router-dom";
import "./Intro.css";
import axios from '../../utils/axios'

const Intro = () => {
  const navigate = useNavigate();

  const handleStart = async () => {
    try {

      await axios.get("/auth/me");

      navigate("/modes");

    } catch (err) {
      navigate("/login");
    }
  };

  return (
    <div className="intro">
      {/* <h1>NOIR</h1> */}
      <img src="/images/IntroPageNoir.png" alt="" />
      <p>Connect the truth.</p>

      <button onClick={handleStart}>
        Start Investigation
      </button>
    </div>
  );
};

export default Intro;