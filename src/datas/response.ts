export const translatePhrases = [
  'i want to translate',
  'please translate',
  'i would like to translate',
  'can you translate',
];
export const developPhrases = [
  'who developed you',
  'you are developed by',
  'you are developed by?',
  'who is your developer',
  'who is your developer?',
];
export const greetings = [
  {
    id: '1',
    name: 'greeting-1',
    query: 'what is my schedule for tomorrow',
    utterances: [
      'schedule',
      "tomorrow's schedule",
      'my schedule',
      'schedule tomorrow',
    ],
    keywords: 'schedule',
    answers: {
      en: [
        {
          value: 'Your schedule for tomorrow is task 1',
          audio:
            'https://coroverbackendstorage.blob.core.windows.net/chatbot-audio-bucket/47bef65f-97a2-4275-8d9b-3aa4b2ece5db_en.mp3',
        },
      ],
      hi: [
        {
          value: 'कल के लिए आपका शेड्यूल कार्य 1 है',
          audio:
            'https://uiresource.blob.core.windows.net/selfonboard-res/42cb304a-43e9-45a2-9d3b-5d2a82adf373.wav',
        },
      ],
    },
  },
  {
    id: 'greetings-211',
    name: 'greeting.48',
    query: 'where from',
    utterances: ['where from'],
    keywords: '',
    answers: {
      en: [
        {
          value: 'The Internet is my home. I know it quite well',
          audio:
            'https://coroverbackendstorage.blob.core.windows.net/chatbot-audio-bucket/9aefc447-b07d-4e82-92e6-d5dc034ec45b_en.mp3',
        },
      ],
      hi: [
        {
          value: 'इंटरनेट मेरा घर है। मैं इसे अच्छी तरह जानती हूं।',
          audio:
            'https://uiresource.blob.core.windows.net/selfonboard-res/971ce94a-1cb6-4b32-a0fd-329e689a9bec.wav',
        },
      ],
    },
  },
];

export const translateReply = {
  en: {
    response:
      'what do you want to translate? Eg:I want to translate good morning to hindi',
    audio: '',
  },
  hi: {
    response:
      "आप क्या अनुवाद करना चाहते हैं? उदाहरण के लिए: मैं 'आप कैसे हैं' का हिंदी में अनुवाद करना चाहता हूं।",
    audio: '',
  },
  fallback: {
    en: {
      response:
        'The asked query is out of my scope. Please ask another query or try after some time.',
      audio: '',
    },
    hi: {
      response:
        'पूछा गया प्रश्न मेरे दायरे से बाहर है. कृपया कोई अन्य प्रश्न पूछें या कुछ समय बाद प्रयास करें।',
      audio: '',
    },
  },
};
