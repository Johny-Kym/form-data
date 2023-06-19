import { useState, useRef } from "react";
import "./App.css";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import SimpleSnackbar from "./components/SimpleSnackbar";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Password } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, IconButton } from "@mui/material";
function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [heroFile, setHeroFile] = useState([]);
  const [profileFile, setProfileFile] = useState([]);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [HeroimageUrl, setHeroImageUrl] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const heroFileInput = useRef();
  const profileFileInput = useRef();
  const imageContainer = useRef();

  const pickHeroFileHandler = () => {
    console.log("file picker");
    heroFileInput.current.click();
  };
  const pickProfileFileHandler = () => {
    profileFileInput.current.click();
  };
  const onHeroFileSelectHandler = (e) => {
    console.log(e.target.files);
    setHeroFile(e.target.files);
    const urls = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setHeroImageUrl(urls[0]);
  };
  const onProfileFileSelectHandler = (e) => {
    console.log(e.target.files);
    setProfileFile(e.target.files);
    const urls = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setProfileImageUrl(urls[0]);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("image", heroFile[0]);
    formData.append("image", profileFile[0]);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      setLoading(true);
      setResponse(null);
      setError(null);
      const response = await axios.post(
        "https://form-data-80ax.onrender.com/upload",
        formData,
        config
      );
      setLoading(false);
      setResponse(response?.data);
      console.log(response?.data);
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <IconButton>
          <ArrowBackIcon />
        </IconButton>

        <h2>Profile</h2>
      </nav>
      {loading ? (
        <Box className="mobile-progress" sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : null}
      {loading ? (
        <Box className="desktop-progress" sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : null}
      {error ? (
        <Alert severity="error">{error?.response?.data?.message}</Alert>
      ) : null}
      <div className="images-container">
        <div
          style={{ backgroundImage: `url(${HeroimageUrl})` }}
          className="hero-container "
        >
          <input
            className="file-input"
            ref={heroFileInput}
            onChange={onHeroFileSelectHandler}
            type="file"
            name="images"
          ></input>
          <div className="backdrop">
            <AddPhotoAlternateIcon
              onClick={pickHeroFileHandler}
              fontSize="large"
            />
          </div>
        </div>
        <div
          style={{ backgroundImage: `url(${profileImageUrl})` }}
          className="profile-container"
        >
          <input
            className="file-input"
            ref={profileFileInput}
            onChange={onProfileFileSelectHandler}
            type="file"
            name="profileImage"
          ></input>
          <div className="backdrop">
            <AddPhotoAlternateIcon
              onClick={pickProfileFileHandler}
              fontSize="large"
            />
          </div>
        </div>
      </div>

      <form onSubmit={submitHandler}>
        <div>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            placeholder="Enter name..."
          ></input>
        </div>
        <div>
          <label>Email</label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            required
            placeholder="Enter email..."
          ></input>
        </div>

        <div className="btn-container">
          <button disabled={loading}>
            {!loading ? "Save" : "Please wait..."}
          </button>
        </div>
      </form>
      {response ? <SimpleSnackbar message={response?.message} /> : null}
    </div>
  );
}

export default App;
