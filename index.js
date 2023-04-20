const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');

const app = express();
const port = 5000 || process.env.PORT;
app.use(bodyParser.json());
app.use(cors());

const model = tf.loadLayersModel('./model/model_resnet.h5');
const upload = multer({ storage: multer.memoryStorage() });

app.post('/predict', upload.single('image'), (req, res) => {
    const imgBuffer = req.file.buffer;
    const img = tf.node.decodeImage(imgBuffer);
    const preprocessed = preprocessImage(img);
    const predictions = model.predict(preprocessed);
    const predictedClass = tf.argMax(predictions, axis=1).dataSync()[0];
    res.json({ predictedClass });
});

function preprocessImage(img) {
    const resized = tf.image.resizeBilinear(img, [224, 224]);
    const normalized = resized.sub(255 / 2).div(255 / 2);
    const batched = normalized.expandDims(0);  
    return batched;
}

app.listen(port, () => console.log(`Server running on port ${port}`));