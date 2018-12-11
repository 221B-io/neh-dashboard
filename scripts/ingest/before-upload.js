const axios = require('axios');
body = {
  mappings: {
    grant: {
      properties: {
        grantId: { type: 'text' }, // unique
        projectDirector: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword'
            }
          }
        },
        directorGender: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword'
            }
          }
        },
        title: { type: 'text' },
        description: { type: 'text' },
        fields: { type: 'text' }, // array
        program: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword'
            }
          }
        },
        division: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword'
            }
          }
        },
        approvedUsd: { type: 'long' },
        awardedUsd: { type: 'long' },
        grantStartDate: { type: 'date', format: 'yyyy-MM-dd' },
        grantEndDate: { type: 'date', format: 'yyyy-MM-dd' },
        products: {
          properties: {
            grantId: { type: 'text' },
            title: { type: 'text' },
            author: { type: 'text' },
            authorGender: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword'
                }
              }
            },
            abstract: { type: 'text' },
            year: { type: 'long' },
            publisher: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword'
                }
              }
            },
            type: { type: 'text' },
            isbn: { type: 'text' },
            primaryURL: { type: 'text' },
            primaryURLRoot: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword'
                }
              }
            },
            primaryURLResolves: { type: 'boolean' },
            primaryURLDescription: { type: 'text' },
            secondaryURL: { type: 'text' },
            secondaryURLRoot: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword'
                }
              }
            },
            secondaryURLResolves: { type: 'boolean' },
            secondaryURLDescription: { type: 'text' }
          }
        },
        institution: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword'
            }
          }
        }
      }
    }
  }
};

(async () => {
  let results = await axios.delete('http://localhost:9200/neh');
  console.log(results.data);
  let results2 = await axios.put('http://localhost:9200/neh', body);
  console.log(results2.data);
})();
