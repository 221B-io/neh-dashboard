const bodybuilder = require('bodybuilder');

// let query = bodybuilder()
//   .query('match', 'message', 'this is a test')
//   .build();

// console.log(query);

/*
  Given a JSON file:
  [{x:foo, y:bar}, {x:baz,y:bar}, {x:foo,y:baq,z:boo}]
1.
  Take the union of every field name 
  and use that to generate all discrete field search options
2.
  Add the ability to add hardcoded matches, i.e.
  I select the field "y" from a dropdown and type in "bar" next to it.
  This would generate the correct query to search for that.
3.
  Add the ability to chain together multiple hardcoded matches with AND or OR.
*/
jsonFile = [
  { x: 'foo', y: 'bar' }, 
  { x: 'baz', y: 'bar' }, 
  { x: 'foo', y: 'baq', z: 'boo' }
];

// Returns a union of the keys of every object in an array.
var fields = [...new Set(jsonFile.reduce((r, e) => [...r, ...Object.keys(e)], []))];

body = bodybuilder();

function addMatch(field, value) {
  body = body.query('match', field, value);
}

function build() {
  return body.build();
}

addMatch('foo', 'bar');
console.log(build());