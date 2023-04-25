import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import os from 'os';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


const app = express();
app.use(cors());
app.use(express.json());



// app.use((req, res, next) => {
//     const deviceId = req.headers['x-device-id'];
  
//     // if (deviceId === '12345') {
//     //   next();
//     // } else {
//     //   res.status(403).send('Unauthorized');
//     // }
//     console.log(deviceId);
//     next();
//   })

app.get('/', async (req, res) => {
    const networkInterfaces = os.networkInterfaces();
    console.log(networkInterfaces['eth0'][0].address);

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