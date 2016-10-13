//The following object has the settings for the ES analyzer for our indexed
//articles.

const analyzer_settings = {
  analyzer: {
    esp_analyzer: {
      type: 'custom',
      tokenizer: 'standard',
      filter: ['lowercase',
	       'esp_length',
	       'esp_stop',
	       'asciifolding',
	       'esp_stemmer']
    },
    eng_analyzer: {
      type: 'custom',
      tokenizer: 'standard',
      filter: ['lowercase',
	       'possessive_eng',
	       'eng_length',
	       'eng_stop',
	       'eng_stemmer']
    }
  },  
  filter: {
    esp_length: {
      type: 'length',
      min: 4,  
      max: 20
    },
    esp_stop: {
      type: 'stop',  
      stopwords: '_spanish_'
    },
    esp_stemmer: {
      type: 'stemmer',
      name: 'spanish'
    },
    eng_length: {
      type: 'length',
      min: 3,  
      max: 20
    },
    eng_stop: {
      type: 'stop',  
      stopwords: '_english_'
    },
    eng_stemmer: {
      type: 'stemmer',
      name: 'english'
    },
    possessive_eng: {
      type: 'stemmer',
      name: 'possessive_english'
    }
  }
}

module.exports = analyzer_settings;



