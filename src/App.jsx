import { useState } from 'react';
import pica from 'pica';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');

  const handleImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(URL.createObjectURL(imageFile));

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch('http://localhost:5000/api/recognize', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setRecognizedText(data.text || 'No text recognized.');

      // Resize the uploaded image using pica
      const p = pica();
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      const resizedImageBlob = await p.resize(imageFile, canvas);
      setEnhancedImage(URL.createObjectURL(resizedImageBlob));
    } catch (error) {
      console.error('Error recognizing text and enhancing image:', error);
    }
  };

  return (
    <div className="container">
      <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {selectedImage && <img src={selectedImage} alt="Selected" />}
      </div>
      <div className="recognized-text">
        <h2>Recognized Text:</h2>
        <p>{recognizedText}</p>
      </div>
      {enhancedImage && (
        <div className="enhanced-image">
          <h2>Enhanced Image:</h2>
          <img src={enhancedImage} alt="Enhanced" />
        </div>
      )}
    </div>
  );
}

export default App;
