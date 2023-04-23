const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');
const path = require('path')

const app = express();
const port = 5000 || process.env.PORT;
app.use(bodyParser.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });
const modelPath = path.resolve('./model/json/model.json');
const classes = ['Bear', 'Brown bear', 'Bull', 'Butterfly', 'Camel', 'Canary', 'Caterpillar', 'Cattle', 'Centipede', 'Cheetah', 'Chicken', 'Crab', 'Crocodile', 'Deer', 'Duck', 'Eagle', 'Elephant', 'Fish', 'Fox', 'Frog', 'Giraffe', 'Goat', 'Goldfish', 'Goose', 'Hamster', 'Harbor seal', 'Hedgehog', 'Hippopotamus', 'Horse', 'Jaguar', 'Jellyfish', 'Kangaroo', 'Koala', 'Ladybug', 'Leopard', 'Lion', 'Lizard', 'Lynx', 'Magpie', 'Monkey', 'Moths and butterflies', 'Mouse', 'Mule', 'Ostrich', 'Otter', 'Owl', 'Panda', 'Parrot', 'Penguin', 'Pig', 'Polar bear', 'Rabbit', 'Raccoon', 'Raven', 'Red panda', 'Rhinoceros', 'Scorpion', 'Sea lion', 'Sea turtle', 'Seahorse', 'Shark', 'Sheep', 'Shrimp', 'Snail', 'Snake', 'Sparrow', 'Spider', 'Squid', 'Squirrel', 'Starfish', 'Swan', 'Tick', 'Tiger', 'Tortoise', 'Turkey', 'Turtle', 'Whale', 'Woodpecker', 'Worm', 'Zebra']

app.post('/predict', upload.single('image'), async (req, res) => {
    const imgBuffer = req.file.buffer;
    const img = tf.node.decodeImage(imgBuffer);
    const preprocessed = preprocessImage(img);
    const model = await tf.loadLayersModel(`file://${modelPath}`);
    const predictions = model.predict(preprocessed);
    const predictedClass = tf.argMax(predictions, axis=1).dataSync()[0];
    res.json({ class: classes[predictedClass] });
});

function preprocessImage(img) {
    const resized = tf.image.resizeBilinear(img, [224, 224]);
    const normalized = resized.sub(255 / 2).div(255 / 2);
    const batched = normalized.expandDims(0);  
    return batched;
}

app.listen(port, () => console.log(`Server running on port ${port}`));