import express from "express";
import multer from "multer";
import Tesseract from "tesseract.js";

const app = express();
const port = 5000;

const upload = multer({ dest: "uploads/" });

app.post("/api/recognize", upload.single("image"), async (req, res) => {
  try {
    const { path } = req.file;

    const {
      data: { text },
    } = await Tesseract.recognize(
      path,
      "eng", // Language code for English
      { logger: (m) => console.log(m) }
    );

    res.json({ text });
  } catch (error) {
    console.error("Error recognizing text:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
