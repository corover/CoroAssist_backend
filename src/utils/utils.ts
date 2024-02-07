import axios from 'axios';
const cred = require('../../gcp.json');
import textToSpeech from '@google-cloud/text-to-speech';
import { Storage } from '@google-cloud/storage';
const googleTranslate = require('google-translate')(
  'AIzaSyCAPKjw4U8MgkXrcXh1xEuogF3TQopKyac',
);
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

export const getLanguage = async (input) => {
  return new Promise((resolve, reject) => {
    try {
      googleTranslate.detectLanguage(input, async (err, res) => {
        if (err != null) {
          console.log(err);
          resolve(null);
        }
        resolve(res.language);
      });
    } catch (err) {
      console.log('Error is:', err);
      resolve(null);
    }
  });
};

export const generateAudio = async (value, lang) => {
  if (lang == 'or' || lang == 'ur' || lang == 'as') {
    return await bhashiniTTS(lang, value);
  }
  return await googleTTS(value, lang);
};

const googleTTS = async (value, lang) => {
  try {
    const clientOptions = {
      apiEndpoint: 'us-texttospeech.googleapis.com',
      credentials: {
        client_email: cred.client_email,
        private_key: cred.private_key,
      },
    };
    const client = new textToSpeech.TextToSpeechClient(clientOptions);

    const request: any = {
      input: { text: value },
      voice: { languageCode: `${lang}-IN`, ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };
    const [response] = await client.synthesizeSpeech(request);
    return await upload(response.audioContent);
  } catch (err) {
    console.log('GoogleTTS:', err);
    return '';
  }
};



export const bhashiniTTS = async (sourceLang, text) => {
  const headers = {
    Accept: '*/*',
    Authorization:
      't8V5Y8nNmlfUrUzOgb_BULkGPFeC-QFXhNgMVRXIKRprX6Y9GrM5HvgJ5-G97qj4',
    'Content-Type': 'application/json',
  };
  return await axios
    .post(
      'https://dhruva-api.bhashini.gov.in/services/inference/pipeline',
      {
        pipelineTasks: [
          {
            taskType: 'tts',
            config: {
              language: {
                sourceLanguage: sourceLang,
              },
              serviceId: 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4',
              gender: 'female',
              samplingRate: 320000,
            },
          },
        ],
        inputData: {
          input: [
            {
              source: text.slice(0, 720),
            },
          ],
        },
      },
      {
        headers: headers,
      },
    )
    .then(async (res) => {
      let audioContent = res.data.pipelineResponse[0].audio[0].audioContent;  
      return await upload(Buffer.from(audioContent, 'base64'));
    })
    .catch((err) => {
      console.log('TTS error:', err);
      return '';
    });
};

const upload = async (buffer) => { 
  return await uploadGCP(buffer);
};    

const uploadGCP = async (buffer) => {
  try {
   const storage = new Storage({ keyFilename: 'gcp.json' });   
   const file = uuidv4() + '.wav';
   await storage.bucket(process.env.BUCKET_NAME).file(file).save(buffer);
   return `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${file}`;
 } catch (err) {
   console.log('UploadGCP:', err);
   return '';
 }
};
          

const headers = {
  Accept: '*/*',
  Authorization:
    't8V5Y8nNmlfUrUzOgb_BULkGPFeC-QFXhNgMVRXIKRprX6Y9GrM5HvgJ5-G97qj4',
  'Content-Type': 'application/json',
};

export const bhashiniTranslate = async (sourceLang, targetLang, text) => {
  return await axios
    .post(
      'https://dhruva-api.bhashini.gov.in/services/inference/pipeline',
      {
        pipelineTasks: [
          {
            taskType: 'translation',
            config: {
              language: {
                sourceLanguage: sourceLang,
                targetLanguage: targetLang,
              },
              serviceId: '',
            },
          },
        ],
        inputData: {
          input: [
            {
              source: text,
            },
          ],
        },
      },
      {
        headers: headers,
      },
    )
    .then((res) => {
      let response = res.data.pipelineResponse[0].output[0];
      return response.target;
    })
    .catch((err) => {
      console.log('Translate error:', err);
      return '';
    });
};
