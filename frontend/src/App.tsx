import FileUpload from "./components/MediaUpload/FileUpload";
import Navbar from "./components/Navbar";
import VideoCall from "./components/WebRTC/VideoCall";
import VideoPlayer from "./components/WebRTC/VideoPlayer";
import { useRef, useState } from "react";

function App() {
  const [uploadedFileName, setUploadedFileName] = useState("");
  // var dataToTranscribe = new FormData()
  const data = useRef<File>();

  const handleFileUpload = (files: File[]) => {
    console.log("Uploaded files:", files);
    setUploadedFileName(Array.from(files)[0].name);
    data.current = files[0];
  };

  const sendFile = () => {
    if (!data.current) return;

    const formData = new FormData();
    formData.append("file", data.current);
    const requestOptions = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      mode: "no-cors",
      method: "POST",
      body: formData,
    };
    console.log(requestOptions);

    fetch("http://localhost:5000", requestOptions as any as RequestInit).then(
      (response) => {
        console.log(response.body);
      }
    );

    // const formData = new FormData();
    // formData.append("file", data.current!!);
    // console.log(data.current);
    // fetch("http://localhost:5000", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    //   files: data.current!!,
    //   body: formData,
    // } as any as RequestInit).then(async (response) =>
    //   console.log(await response.json())
    // );
  };

  const getFile = () => {
    fetch("http://localhost:5000", {}).then(async (response) =>
      console.log(response.body)
    );
  };

  return (
    <div className="bg-gradient-to-br from-transparent via-sky-500 to-indigo-500 min-h-screen w-screen p-0 text-white bg-[logo]">
      <Navbar />
      {/* <VideoPlayer /> */}
      <VideoCall />
      <FileUpload onFileUpload={handleFileUpload} />
      <p className="text-gray-600">Current File:{uploadedFileName}</p>
      <button onClick={() => sendFile()}>Transcribe File</button>
    </div>
  );
}

export default App;
