//The following objects are the mappings for the ES-types of the documents
//that will be indexed.

const esp_article = {
  properties: {
    format: {
      type: 'string',
      index: 'not_analyzed'
    },
    author: {
      type: 'string',
      index: 'not_analyzed'
    },
    pub_date: {
      type: 'date',
      format: 'strict_date',
      index: 'not_analyzed'
    },
    title: {
      type: 'string',
      analyzer: 'esp_analyzer'
    },
    abstract: {
      type: 'string',
      analyzer: 'esp_analyzer'
    },
    section_titles: {
      type: 'string',
      analyzer: 'esp_analyzer'
    },
    sections: {
      type: 'string',
      analyzer: 'esp_analyzer'
    },
    abstract_image_url: {
      type: 'string',
      index: 'not_analyzed'
    },
    main_image_url: {
      type: 'string',
      index: 'not_analyzed'
    },
    thumbnail_url: {
      type: 'string',
      index: 'not_analyzed'
    },  
    image_urls: {
      type: 'string',
      index: 'not_analyzed'
    },
    video_headers: {
      type: 'string',
      analyzer: 'esp_analyzer'
    },
    video_urls: {
      type: 'string',
      index: 'not_analyzed'
    },
    country: {
      type: 'string',
      analyzer: 'esp_analyzer'
    },
    region: {
      type: 'string',
      analyzer: 'esp_analyzer'
    },
    city: {
      type: 'string',
      analyzer: 'esp_analyzer'
    },
    property_name: {
      type: 'string',
      index: 'not_analyzed'
    } 
  } 
};

const eng_article = {
  properties: {  
    format_eng: {
      type: 'string',
      index: 'not_analyzed'
    },
    author_eng: {
      type: 'string',
      index: 'not_analyzed'
    },
    pub_date_eng: {
      type: 'date',
      format: 'strict_date',
      index: 'not_analyzed'
    },
    title_eng: {
      type: 'string',
      analyzer: 'eng_analyzer'
    },
    abstract_eng: {
      type: 'string',
      analyzer: 'eng_analyzer'
    },
    section_titles_eng: {
      type: 'string',
      analyzer: 'eng_analyzer'
    },
    sections_eng: {
      type: 'string',
      analyzer: 'eng_analyzer'
    },
    abstract_image_url_eng: {
      type: 'string',
      index: 'not_analyzed'
    },
    thumbnail_url_eng: {
      type: 'string',
      index: 'not_analyzed'
    },
    main_image_url_eng: {
      type: 'string',
      index: 'not_analyzed'
    },
    image_urls_eng: {
      type: 'string',
      index: 'not_analyzed'
    },
    video_headers_eng: {
      type: 'string',
      analyzer: 'eng_analyzer'
    },
    video_urls_eng: {
      type: 'string',
      index: 'not_analyzed'
    },
    country_eng: {
      type: 'string',
      analyzer: 'eng_analyzer'
    },
    region_eng: {
      type: 'string',
      analyzer: 'eng_analyzer'
    },
    city_eng: {
      type: 'string',
      analyzer: 'eng_analyzer'
    },
    property_name_eng: {
      type: 'string',
      index: 'not_analyzed'
    }
  }  
};



module.exports = {
  esp_article: esp_article,
  eng_article: eng_article
};




