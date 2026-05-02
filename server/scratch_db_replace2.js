const mongoose = require('mongoose');
const PageContent = require('./models/PageContent');

async function replaceInObj(obj) {
  if (typeof obj === 'string') {
    return obj.replace(/SITATRA/g, 'Sitara')
              .replace(/sitatra/g, 'sitara')
              .replace(/Sitatra/g, 'Sitara');
  } else if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => replaceInObj(item)));
  } else if (obj !== null && typeof obj === 'object') {
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

mongoose.connect('mongodb+srv://sitara:sitara12345@sitara.j9714ye.mongodb.net/?appName=Sitara', { useNewUrlParser: true, useUnifiedTopology: true })
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
    console.log('DB replacement complete.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
