const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const PageContent = require('./models/PageContent');
const SiteSettings = require('./models/SiteSettings');

async function replaceInObj(obj) {
  if (typeof obj === 'string') {
    return obj.replace(/SITATRA/g, 'Sitara')
              .replace(/sitatra/g, 'sitara')
              .replace(/Sitatra/g, 'Sitara');
  } else if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => replaceInObj(item)));
  } else if (obj !== null && typeof obj === 'object') {
    // If it's a Map
    if (obj instanceof Map) {
      for (const [key, val] of obj.entries()) {
        obj.set(key, await replaceInObj(val));
      }
      return obj;
    }
    const newObj = {};
    for (const key in obj) {
      newObj[key] = await replaceInObj(obj[key]);
    }
    return newObj;
  }
  return obj;
}

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const pages = await PageContent.find({});
    for (const page of pages) {
      if (page.sections) {
        let changed = false;
        for (const [key, sectionData] of page.sections.entries()) {
          const newData = await replaceInObj(sectionData);
          if (JSON.stringify(newData) !== JSON.stringify(sectionData)) {
            page.sections.set(key, newData);
            changed = true;
          }
        }
        if (changed) {
          page.markModified('sections');
          await page.save();
          console.log(`Updated page: ${page.page}`);
        }
      }
    }
    
    // Also update settings
    const settings = await SiteSettings.findOne({});
    if (settings && settings.siteName && settings.siteName.includes('SITATRA')) {
      settings.siteName = settings.siteName.replace(/SITATRA/g, 'Sitara');
      await settings.save();
      console.log('Updated SiteSettings');
    }
    
    console.log('DB replacement complete.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
