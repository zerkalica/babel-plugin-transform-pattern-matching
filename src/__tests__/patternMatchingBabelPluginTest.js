/* eslint-env mocha */
import fs from 'fs'
import {transform} from 'babel-core'
import path from 'path'
import assert from 'assert'

const exampleFile = fs.readFileSync(
    path.join(__dirname, 'data', 'ExampleReducer.js')
).toString()
const exampleTranspiledFile = fs.readFileSync(
    path.join(__dirname, 'data', 'ExampleReducerTranspiled.js')
).toString()

const pluginPath = path.join(__dirname, '..', 'index.js')

const babelConfig = {
  plugins: [
      'syntax-flow',
      'syntax-decorators',
      pluginPath
  ]
}

describe('patternMatchingBabelPluginTest', () => {
    it('test successful for ExampleReducer', () => {
        const {code} = transform(exampleFile, babelConfig)
        // fs.writeFileSync(path.join(__dirname, 'data', 'ExampleReducerTranspiled.js'), code)
        assert(code === exampleTranspiledFile)
    })
})
