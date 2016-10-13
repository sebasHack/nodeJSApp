const express = require('express');
const elasticsearch = require('elasticsearch');
const validator = require('validator');
const helpers = require('./helpers');
const qs = require('qs');


function get_router(env_config) {
  const index_name = env_config.es_settings.index_name;
  const client = new elasticsearch.Client({
    host: env_config.es_settings.es_host,
    log: 'trace'
  });

  const router = express.Router();
  router
    .get('/', (req, res, next) => {
      const lang = req.cookies.locale || req.locale;
      const from = 0;
      const size = 24;
      const query_lang = ['es', 'esp'].includes(lang) ? 'es' : 'en';
      const date_field = query_lang === 'es' ? 'pub_date' : 'pub_date_eng';

      const keys = ['title', 'author', 'abstract', 'abstract_image_url', 'pub_date'];
      const fields = query_lang === 'es' ? keys : keys.map((k) => k + '_eng');
      
      const query_body = {
	query: {
	  match_all: {}
	}
      };

      const query_params = {
	index: index_name,
	type: query_lang === 'es' ? 'esp_article' : 'eng_article',
	body: query_body,
	from: from,
	size: size,
	sort: date_field + ':desc',
	_source: fields
      };

      client.search(query_params, (err, es_res) => {

	if (err) {
	  next(new Error('Internal Server Error: Search could not be performed'));
	  return; 
	};
        
	const hits = es_res.hits.hits;
	

	if(hits.length < 24) {
	  res.send('Not enough articles to start...');
	  return;
	}
	
	const abstracts = hits.map(helpers.get_fields.bind(null, fields, query_lang));
	
	const res_obj = {
	  newest_abstract: abstracts[0],
	  abstracts: helpers.pair_array(abstracts.slice(1,21)),
	  oldest_abstracts: abstracts.slice(21),
	  locale: req.cookies.locale
	};
	res.render('index.pug', res_obj);
	
      });
    })
    .get('/publications/search', (req, res, next) => {
      const lang = req.cookies.locale || req.locale;
      const words = req.query.words || '';
      const from = req.query.from || 0;
      const size = 10;
      const query_lang = ['es', 'esp'].includes(lang) ? 'es' : 'en';
      const keys = ['title', 'author', 'abstract', 'thumbnail_url', 'pub_date'];
      const fields = query_lang === 'es' ? keys : keys.map((k) => k + '_eng');
      
      const query_body = {
	query: {
	  multi_match: {
	    query: words,
	    fields: query_lang === 'es' ? helpers.esp_fields : helpers.eng_fields,
	    operator: 'or',
	    analyzer: query_lang === 'es' ? 'esp_analyzer' : 'eng_analyzer'
	  }
	}
      };

      const query_params = {
	index: index_name,
	type: query_lang === 'es' ? 'esp_article' : 'eng_article',
	body: query_body,
	from: from,
	size: size,
	_source: fields
      };

      client.search(query_params, (err, es_res) => {
	if (err) {
	  console.trace(err.message);
	  next(new Error('Internal Server Error: Search could not be performed'));
	  return;
	};

        
        const base_url = '/publications/search?';

	const prev_page = parseInt(from, 10) - 10;
	const previous_url_query = qs.stringify({
	  words: words,
	  lang: query_lang,
	  from: prev_page
	});

	const next_page = parseInt(from, 10) + 10;
	const next_url_query = qs.stringify({
	  words: words,
	  lang: query_lang,
	  from: next_page
	});

	const previous_url = base_url + previous_url_query;
	const next_url = base_url + next_url_query; 

	
	const hits = es_res.hits.hits;
	const results = hits.map(helpers.get_fields.bind(null, fields, query_lang));
        const res_obj = {
	  head_title: query_lang == 'en' ? "DestinosIO | Results" : "DestinosIO | Resultados",
	  locale: req.cookies.locale,
	  results: results,
          results_length: es_res.hits.total,
	  search_words: words.toLowerCase(),
	  prev_url: prev_page >= 0 ? previous_url : '#',
	  next_url: next_page < es_res.hits.total ? next_url : '#',
	  page: Math.round((from / 10) + 1).toString()
	};
	
	
	res.render('results.pug', res_obj);
      });
    })
    .get('/publications/:art_id', (req, res, next) => {
      const lang = req.cookies.locale || req.locale;
      const query_lang = ['es', 'esp'].includes(lang) ? 'es' : 'en';
      const query_params = {
	index: index_name,
	type: query_lang === 'es' ? 'esp_article' : 'eng_article',
	id: req.params.art_id
      };

      client.get(query_params, (err, es_res) => {

        if (es_res && es_res.found === false) {
	  console.trace(err.message);
	  next(new Error('Article was not found'));
	  return;
	};
	
	if (err) {
	  console.trace(err.message);
	  next(new Error('Internal Server Error: Search could not be performed'));
	  return;
	};
	
	const res_obj = {
	  locale: req.cookies.locale,
	  article: helpers.transform_article(es_res)
	};

        res_obj.head_title = res_obj.article.title;
        
	res.render( 'article-template.pug', res_obj );
        
      });
      
    });


  return router;
}




module.exports = get_router;
