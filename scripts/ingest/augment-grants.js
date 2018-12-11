const fs = require('fs');
const gender = require('gender-detection');

let products = fs.readFileSync('../../data/json/products.json', {
  encoding: 'utf-8'
});
let resolveStates = fs.readFileSync('../../data/json/resolveStateOfUrls.json', {
  encoding: 'utf-8'
});
products = JSON.parse(products);
resolveStates = JSON.parse(resolveStates);

let files = fs.readdirSync('../../data/json/by-year');

const rootRegex = /([a-z0-9\-]+\.(co\.)?(ac\.)?([^.\/])*)($|\/)/i;

for (let i = 0; i < files.length; i += 1) {
  let grantFileName = files[i];
  let grantFile = fs.readFileSync(`../../data/json/by-year/${grantFileName}`, {
    encoding: 'utf-8'
  });
  let grants = JSON.parse(grantFile);
  for (let j = 0; j < grants.length; j += 1) {
    let grant = grants[j];
    if (!grant.products) {
      grant.products = [];
    }

    if (grant.grantStartDate) {
      const startDate = grant.grantStartDate.split('/');
      const sDay = startDate[1];
      const sMonth = startDate[0];
      const sYear = startDate[2];
      grant.grantStartDate = `${sYear}-${sMonth}-${sDay}`;
    }

    if (grant.grantEndDate) {
      const endDate = grant.grantEndDate.split('/');
      const eDay = endDate[1];
      const eMonth = endDate[0];
      const eYear = endDate[2];
      grant.grantEndDate = `${eYear}-${eMonth}-${eDay}`;
    }

    if (grant.projectDirector) {
      grant.projectDirector = grant.projectDirector.replace(/\(.*\)/, '');
      grant.projectDirector = grant.projectDirector.trim();
      grant.directorGender = gender.detect(
        gender.getFirstName(grant.projectDirector)
      );
    }

    for (let k = 0; k < products.length; k += 1) {
      let product = products[k];
      if (grant.grantId === product.grantId) {
        // check if URL is in resolveStates
        // if so, add the correct data

        // Add author gender data

        if (product.author && typeof product.author === 'string') {
          if (Array.isArray(product.author)) {
            product.authorGender = product.author.map(x =>
              gender.detect(gender.getFirstName(product.author))
            );
          } else {
            product.authorGender = gender.detect(
              gender.getFirstName(product.author)
            );
          }
        }

        // ADD PRIMARY URL DATA
        if (product.primaryURL) {
          try {
            product.primaryURLRoot = product.primaryURL.match(rootRegex)[1];
            if (product.primaryURLRoot.includes('ac.uk')) {
              console.log(product.primaryURLRoot);
            }
          } catch (e) {
            console.log(`Failed to get root: ${e.message}`);
            console.log(`Failed on ${product.primaryURL}`);
          }
          for (let l = 0; l < resolveStates.length; l += 1) {
            if (resolveStates[l].url === product.primaryURL) {
              product.primaryURLResolves = resolveStates[l].resolves;
              break;
            }
          }
        }

        // ADD SECONDARY URL DATA
        if (product.secondaryURL) {
          try {
            product.secondaryURLRoot = product.secondaryURL.match(rootRegex)[1];
            if (product.secondaryURLRoot.includes('ac.uk')) {
              console.log(product.secondaryURLRoot);
            }
          } catch (e) {
            console.log(`Failed to get root: ${e.message}`);
            console.log(`Failed on ${product.secondaryURL}`);
          }
          for (let l = 0; l < resolveStates.length; l += 1) {
            if (resolveStates[l].url === product.secondaryURL) {
              product.secondaryURLResolves = resolveStates[l].resolves;
              break;
            }
          }
        }
        grant.products.push(product);
      }
    }
  }
  fs.writeFileSync(
    `../../data/json/by-year-with-products/${grantFileName}`,
    JSON.stringify(grants, null, 2)
  );
  console.log(`finished with ${grantFileName}`);
}
