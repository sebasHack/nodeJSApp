const analyzer_settings = require('../mappings/analyzer-settings');
const mappings = require('../mappings/mappings');
const config = require('../config.json');
const elasticsearch = require('elasticsearch');

//Get configuration object according to the value of NODE_ENV
const env_config = config[process.env.NODE_ENV || 'development']; 

const client = new elasticsearch.Client({
  host: env_config.es_settings.es_host,
  log: 'trace'
});


/*The name of the index is determined according to
 the environment: articles_dev or articles_prod.*/
const index_name = env_config.es_settings.index_name;


//Create index according to the configuration settings.
client.indices.exists({ index: index_name }, (err, res) => {
  if (err) {
    console.trace(err.message);
    return;
  }
  
  if (res) {
    console.log('Index ' + index_name + ' already exists');
    return;
  }

  const index_settings = env_config.es_settings.index_settings;

  index_settings.analysis = analyzer_settings;
  
  const req_body = {
    settings: index_settings,
    mappings: mappings
    //Place other options if necessary
  }; 

  const req_params = {
    index: index_name,
    body: req_body
  };
  
  client.indices.create(req_params, (err, res) => {
    if (err) {
      console.trace(err.message);
      return;
    }

    console.log('Index ' + index_name + ' has been successfully created.');
  });
});

