const esp_fields = ['title^3',
		    'abstract^2',
		    'section_titles^2',
		    'sections',
		    'video_headers^2',
		    'country',
		    'region',
		    'city'];

const eng_fields = ['title_eng^3',
		    'abstract_eng^2',
		    'section_titles_eng^2',
		    'sections_eng',
		    'video_headers_eng^2',
		    'country_eng',
		    'region_eng',
		    'city_eng'];


function get_fields(keys, lang, es_hit) {
  let obj = {};
  
  const fields = keys;

  fields.forEach((f) => {
    const k = lang === 'es' ? f : f.substr(0, f.length - 4);
    obj[k] = es_hit._source[f];
  });

  obj.id = es_hit._id;
  obj.type = es_hit._type;
  obj.index = es_hit._index;
  
  return obj;
    
}


function pair_array(arr) {
  let paired_arr = [];

  let pair = [];

  arr.forEach((elt) => {
    if (pair.length < 2){
      pair.push(elt);
    }

    if (pair.length === 2 ) {
      let temp = pair;
      paired_arr.push(temp);
      pair = [];
    }
    
  });
  return paired_arr;
}

function transform_article(es_res) {
  const lang = es_res._type === 'esp_article' ? 'es' : 'en';
  const keys = ['main_image_url', // 0
		'title', // 1
		'author', // 2
		'pub_date', // 3
		'abstract', // 4
		'section_titles', // 5
	        'sections', // 6
	        'image_urls', // 7
	        'format', //8
	        'video_headers', //9
	        'video_urls']; //10
  
  const section_formats = ['img_down', 'img_left', 'img_right'];
  const fields = lang === 'es' ? keys : keys.map((k) => k + '_eng'); 
  const source = es_res._source;
  
  const section_titles = source[fields[5]];
  const section_texts = source[fields[6]];
  const section_imgs = source[fields[7]];
  const num_sections = section_titles.length;
  const sections = [];

  
  for ( i = 0; i < num_sections; i++ ) {
    let ran_num = Math.floor((Math.random() * 3));
    sections.push({
      title: section_titles[i],
      text: section_texts[i],
      image_url: section_imgs[i],
      format: section_formats[ran_num] 
    });
  }
  
  return {
    id: es_res._id, 
    main_image_url: source[fields[0]],
    title: source[fields[1]], 
    author: source[fields[2]], 
    pub_date: source[fields[3]], 
    abstract: source[fields[4]],
    sections: sections,
    format: source[fields[8]],
    video_headers: source[fields[9]],
    video_urls: source[fields[10]]
  };
   
}


module.exports = {
  get_fields: get_fields,
  pair_array: pair_array,
  transform_article: transform_article,
  esp_fields: esp_fields,
  eng_fields: eng_fields
};
