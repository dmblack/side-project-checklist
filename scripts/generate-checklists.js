const http = require('https');
const fs = require('fs');
const checklistPaths = [
  {
    origin: 'https://raw.githubusercontent.com/karllhughes/side-project-marketing/master/marketing-checklist.md',
    destination: './marketing-checklist.md',
  },
  {
    origin: 'https://raw.githubusercontent.com/karllhughes/side-project-sales/master/sales-checklist.md',
    destination: './sales-checklist.md',
  },
];

function run(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  // Need to add header:
  /*
   ---
   layout: checklist_page
   title: The Side Project Marketing Checklist
   permalink: /marketing-checklist/
   ---
   */

  http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
}

checklistPaths.map(checklist => {
  if (checklist && checklist.origin && checklist.destination) {
    run(checklist.origin, checklist.destination, function () {
      console.log("File saved: " + checklist.destination);
    });
  }
});
