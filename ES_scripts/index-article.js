const fs = require('fs');
const elasticsearch = require('elasticsearch');
const path = require('path');
const config = require('../config.json');

const env_config = config[process.env.NODE_ENV || 'development']; 

const client = new elasticsearch.Client({
  host: env_config.es_settings.es_host,
  log: 'trace'
});

const index_name = env_config.es_settings.index_name;


function index_document() {
  const file_name = process.argv[2] || false;
  
  if(!file_name) {
    console.log("You haven't provided a file_name");
    return;
  }
  
  const file_path = path.resolve(__dirname, '../','articles', file_name);
  console.log(file_path);
  if (!fs.existsSync(file_path)) {
    console.log('file ' + file_name + ' does not exists');
    return;
  }
  
  const req_params = JSON.parse(fs.readFileSync(file_path, 'utf8'));

  req_params.index = index_name;
  
  client.index(req_params, (err, res) => {
    if (err) {
      console.trace(err.message);
      return;
    }

    console.log('Document '+ file_name + ' has been added to index ' + index_name);
    
  });
  
}


index_document();
