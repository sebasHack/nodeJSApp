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


function analyze_string() {
  const analyzer  = process.argv[2] || false;
  const string  = process.argv[3] || false;

  if(!analyzer || ! string) {
    console.log("You must provide both an analyzer and a string to test.");
    return;
  }
  
  const req_params = {
    index: index_name,
    analyzer: analyzer,
    text: string
  };
  
  client.indices.analyze(req_params, (err, res) => {
    if (err) {
      console.trace(err.message);
      return;
    }
  });
}

analyze_string();
