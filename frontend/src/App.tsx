import FileUpload from "./components/MediaUpload/FileUpload";
import Navbar from "./components/Navbar";
import VideoPlayer from "./components/WebRTC/VideoPlayer";

function App() {
  const handleFileUpload = (files: File[]) => {
    console.log("Uploaded files:", files);
    // You can add logic here to handle the files (e.g., upload to server)
  };

  return (
    <div className="bg-zinc-900 h-screen w-screen p-0 text-white">
      <Navbar />
      <VideoPlayer />
      <FileUpload onFileUpload={handleFileUpload} />
    </div>
  );
}

export default App;
