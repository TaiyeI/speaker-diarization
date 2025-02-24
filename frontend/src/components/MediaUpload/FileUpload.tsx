import { useDropzone } from "react-dropzone";

type FileUploadProps = {
  onFileUpload: (files: File[]) => void;
};

function FileUpload(props: FileUploadProps) {
  const { onFileUpload } = props;
  const uploadMessage =
    "Drag and drop MP3 or MP4 files here, or click to select files";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      onFileUpload(Array.from(files));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    // accept: ".mp3, .mp4", // Only allow MP3 and MP4 files
    onDrop: (acceptedFiles) => onFileUpload(acceptedFiles),
  });

  return (
    <div className="max-w-md mx-auto p-4 border border-gray-300 rounded-md">
      <div
        {...getRootProps()}
        className="border-dashed border-2 border-gray-400 p-6 text-center rounded-md hover:bg-gray-100 transition cursor-pointer"
      >
        <input {...getInputProps()} className="hidden" />
        <p className="text-gray-600">{uploadMessage}</p>
      </div>

      <input
        type="file"
        accept=".mp3, .mp4, .mpg"
        onChange={handleFileChange}
        className="mt-4 w-full text-sm text-transparent file:border file:rounded file:px-3 file:py-2 file:mr-4 file:cursor-pointer file:bg-gray-100 file:text-gray-700"
      />
    </div>
  );
}

export default FileUpload;
