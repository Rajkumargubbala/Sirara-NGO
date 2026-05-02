const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const PageContent = require('./models/PageContent');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const home = await PageContent.findOne({ page: 'home' });
    console.log(JSON.stringify(home.sections.get('social_feed'), null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
