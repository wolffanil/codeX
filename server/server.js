import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { IpFilter } from 'express-ipfilter';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const ips = ['::ffff:127.0.0.1', '192.168.1.165'];

const app = express();
app.use(cors());
app.use(express.json());
app.use(IpFilter(ips, { mode: 'allow'}))

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