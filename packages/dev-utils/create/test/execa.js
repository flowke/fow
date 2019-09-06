const execa = require('execa');

execa('npm', ['i', 'execa']).stdout.pipe(process.stdout)