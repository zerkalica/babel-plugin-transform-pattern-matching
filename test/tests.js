import glob from 'glob'
glob.sync(__dirname + '/../{src,examples}/**/__tests__/**/*.js').forEach(file => require(file))
