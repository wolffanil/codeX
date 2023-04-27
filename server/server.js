import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import DeviceDetector from "node-device-detector";

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


const app = express();
app.use(cors());
app.use(express.json());

const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
  });
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const result = detector.detect(userAgent);

app.use((req, res, next) => {
    const dev = result.device.model
    // if (deviceId === '12345') {
    //   next();
    // } else {
    //   res.status(403).send('Unauthorized');
    // }
    console.log(dev);
    // Z7 Max
    next();
  })

app.get('/', async (req, res) => {

    res.status(200).send({
        message: 'hello from Codex'
    })
});



app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({ err });
    }
})

app.listen(5000, () => console.log('Server is runnig on port http://localhost:5000'));