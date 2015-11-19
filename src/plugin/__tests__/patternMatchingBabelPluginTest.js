/* eslint-env mocha */
import fs from 'fs'
import {transform} from 'babel-core'
import path from 'path'
import assert from 'power-assert'

const exampleFile = fs.readFileSync(
    path.join(__dirname, 'data', 'ExampleReducer.js')
).toString()


const funcReducerFile = fs.readFileSync(
    path.join(__dirname, 'data', 'FuncReducer.js')
).toString()

const exampleTranspiledFileName = path.join(__dirname, 'data', 'ExampleReducerTranspiled.js')

const pluginPath = path.join(__dirname, '..', '..', 'index.js')

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
        console.log(code)
        // fs.writeFileSync(exampleTranspiledFileName, code)
        // const exampleTranspiledFile = fs.readFileSync(exampleTranspiledFileName).toString()
        // assert(code === exampleTranspiledFile)
    })

    it.skip('test successful for FuncReducer', () => {
        const {code} = transform(funcReducerFile, babelConfig)
        console.log(code)
        // fs.writeFileSync(exampleTranspiledFileName, code)
        // const exampleTranspiledFile = fs.readFileSync(exampleTranspiledFileName).toString()
        // assert(code === exampleTranspiledFile)
    })

})
