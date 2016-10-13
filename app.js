const express = require('express');
const path = require('path');
const i18n = require('i18n-2');
const locale = require('locale');
const config = require('./config.json');
const get_router = require('./routes/article-router');
const cookie_parser = require('cookie-parser');

const environment = process.env.NODE_ENV || 'development';
const env_config = config[environment]; 

const app = express();
app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, 'views'));
app.set('port', process.env.PORT || 3000);
app.set('env', environment);

i18n.expressBind(app, config.i18n_config);

const article_router = get_router(env_config);

const supported_langs = ['en', 'es'];

app
  .use(locale(supported_langs))
  .use(cookie_parser())
  .use((req, res, next) => {
    const locale = req.locale;
    if(!req.cookies.locale) {
      res.cookie('locale', locale);
      req.i18n.setLocale(locale);
      next();
      return;
    }
    
    req.i18n.setLocaleFromCookie();
    next();
  })
  .use('/static', express.static(__dirname + '/public'))
  .get('/locale/:locale', (req, res) => {
   
    const locale = req.params.locale;
    req.i18n.setLocale(locale);
    res.cookie('locale', locale);
    
    const pub_url = req.protocol + '://' + req.get('host') + '/publications/';
    const referer = req.header('referer');
    
    if(referer.startsWith(pub_url)) {
      res.redirect(pub_url + 'search');
      return;
    }
    
    const back_url = referer || '/';  
    res.redirect(back_url);
  })
  .get('/about', (req, res) => {
    const res_obj = {
      head_title: req.cookies.locale == 'en' ? "DestinosIO | About" : "DestinosIO | Nosotros",
      locale: req.cookies.locale
    };
    res.render('about.pug', res_obj );
  })
  .get('/policies', (req, res) => {
    const res_obj = {
      head_title: req.cookies.locale == 'en' ? "DestinosIO | Policies" : "DestinosIO | Políticas",
      locale: req.cookies.locale
    };
    res.render('policies.pug', res_obj );
  })
  .use(article_router)
  .use((err, req, res, next) => {

    res.status(500);
    
    res.render('error.pug', { error_message: err.message }); 
    
  })
  .use((req, res) => {
    res.render('not-available.pug');
  });
  

app.listen(app.get('port'), function() {
  console.log('Server started on port ' + app.get('port'));
});


