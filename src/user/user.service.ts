import { Injectable } from '@nestjs/common';
import { getLanguage, generateAudio, bhashiniTranslate } from 'src/utils/utils';
import { languages } from 'src/datas/languages';
const nlp = require('compromise');
const { v4: uuidv4 } = require('uuid');
import axios from 'axios';
const MiniSearch = require('minisearch');
import {
  greetings,
  translateReply,
  translatePhrases,
  developPhrases
} from 'src/datas/response';
const FormData = require('form-data');
const fs = require('fs');

@Injectable()
export class UserService {
  async sendQuery(body): Promise<any> {
    try {
      let apires;
      const lang = await getLanguage(body.query);
      if (lang !== 'en') {
        body.query = await bhashiniTranslate('hi', 'en', body.query);
      }
      body.query = body.query.toLowerCase();    
      
      if (body.translate == false) {
        if(developPhrases.includes(body.query)){          
          return { response: 'I was developed by Bharat GPT',
            audio: await generateAudio('I was developed by Bharat GPT', lang),
            answerId: uuidv4(),}
        }

        apires = await this.contextCall(body.appID, body.query);
        if (lang !== 'en') {
          apires = await bhashiniTranslate('en', lang, apires);
        }
        const answer = {
          response: apires,
          audio: await generateAudio(apires, lang),
          answerId: uuidv4(),
        };
        return answer;
      }
      console.log(body.query);
     
      const words = body.query.split(/\s+/);
      let target: string = null;
      let targetCode: string = null;
      if (words.includes('translate') || words.includes('translation')) {
        if (words.length === 1) {
          return translateReply[body.lang];
        }
        words.forEach((word) => {
          const lang = languages.find((lang) => lang.lang === word);
          if (lang) {
            target = lang.lang;
            targetCode = lang.code;
          }
        });
        if (target !== null) {
          const regex = new RegExp(`\\b(?:in|to)\\s+${target}\\b`, 'i');
          const modifiedQuery = body.query.replace(regex, '').trim();
          const translateIndex =
            modifiedQuery.indexOf('translate') + 'translate'.length;

          const containsTranslatePhrase = translatePhrases.some((phrase) =>
            body.query.toLowerCase().includes(phrase),
          );
          let textToTranslate;
          if (containsTranslatePhrase) {
            textToTranslate = modifiedQuery.substring(translateIndex).trim();
          } else {
            textToTranslate = modifiedQuery.replace('translate', '').trim();
          }
          console.log(textToTranslate, 'textToTranslate');

          const answer = {
            response:
              lang == targetCode
                ? textToTranslate
                : await bhashiniTranslate(lang, targetCode, textToTranslate),
            audio: '',
            answerId: uuidv4(),
          };
          answer.audio = await generateAudio(answer.response, targetCode);
          return answer;
        } else {          
          const answer = {
            response: body.lang=="en"?'please enter query in correct format':await bhashiniTranslate(
              lang,
              body.lang,
              'please enter query in correct format',
            ),
            audio: '',
            answerId: uuidv4(),
          };
          answer.audio = await generateAudio(answer.response, body.lang);
          return answer;
        }
      } else {
        return this.intentSearch(body);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  
  async fileUpload(body, file): Promise<any> {
    const formData = new FormData();
    formData.append('uploadFile', file.buffer, 'file.pdf');
    const headers = {
      'Accept-Language': 'en-US,en;q=0.9',
      Expires: '0',
      Origin: 'https://builder.corover.ai',
      Pragma: 'no-cache',
      Referer: 'https://builder.corover.ai/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'sec-ch-ua':
        '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'appId': body.userToken,
      ...formData.getHeaders(),
    };

    const url = 'https://builder.corover.ai/selfonboardAPI/self/upload';
    try {
      const response = await axios.post(url, formData, { headers });
      return await this.upload(response.data,body.userToken);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }


  async upload(file,userToken): Promise<any> {
    try {    
      const payload = { 'urls': [file.imageUrl] }
      console.log(payload,"payload here");
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://builder.corover.ai/selfonboardAPI/bot/trainBharatVertex',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept-Language': 'en-CA,en;q=0.9,fr-CA;q=0.8,fr;q=0.7,en-US;q=0.6,en-GB;q=0.5', 
          'Cookie': '_gid=GA1.2.352214555.1721805869; _ga=GA1.1.82458110.1716920555; _ga_7K0RMWL72E=GS1.1.1721805869.9.0.1721805869.0.0.0; FCNEC=%5B%5B%22AKsRol-W-OBcyHnofdZrfxIwafs14saoBrHJ37vBFPx7o47DVa2RdPiyUhKEooYNt3NXJxCZO7Etod_85PMWoZYnXe1FrFf9XRevSKJ8FVFuvqptgv1XJ-N7-CFETAJOjQ-gODkxRBXGxjJN9SGocfGoZpCgV10mMw%3D%3D%22%5D%5D', 
          'Expires': '0', 
          'Origin': 'https://builder.corover.ai', 
          'Pragma': 'no-cache', 
          'Referer': 'https://builder.corover.ai/', 
          'Sec-Fetch-Dest': 'empty', 
          'Sec-Fetch-Mode': 'cors', 
          'Sec-Fetch-Site': 'same-origin', 
          'access': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoYXJqaWwgZGhhbmFuaSIsImVtYWlsSWQiOiJzaGFyamlsZGhhbmFuaTQ2QGdtYWlsLmNvbSIsImNvbXBhbnlJZCI6IkNvcm92ZXIiLCJpYXQiOjE3MjE4MDU1OTAsImV4cCI6MTcyMTg5MTk5MH0.4c7n6Ty9_UTgCh0LyaYg9gndtKjC0jQB4424-pxt5mM', 
          'appId': userToken, 
          'sec-ch-ua': 'Not/A', 
          'sec-ch-ua-mobile': '?0', 
          'sec-ch-ua-platform': 'Windows'
        },
        data : payload
      };
      
      let response = await axios.request(config);

      if (response.data.message=== 'Training Done') {
        console.log(response.data,"response after training");
        return {appID:userToken,training:true}
      }       
        return { appID: userToken, training: false };

    } catch (error) {
      console.log(error);
      return error;
    }
  }


  async contextCall(appid, query): Promise<any> {
    const url = 'http://172.105.39.50:9008/bharatgpt/vertexairesponse';
    const payload = {
      appID: appid,
      prompt: query,
      chat_history: [],
    };
    let response = await axios.post(url, payload);
    return response.data.reply;
  }


  async intentSearch(body): Promise<any> {
    let intents = [...greetings];
    let miniSearch = new MiniSearch({
      fields: ['query', 'utterances'],
      storeFields: Object.keys(greetings[0]),
    });
    miniSearch.addAll(intents);
    let result = miniSearch.search(body.query, { fuzzy: 0.3 })[0];
console.log(result);

    if (result&&result.queryTerms.length > 1) {
      return {
        response: result.answers[body.lang][0].value,
        audio: result.answers[body.lang][0].audio,
        answerId: uuidv4(),
      };
    } else {
      return translateReply['fallback'][body.lang];
    }
  }
}
