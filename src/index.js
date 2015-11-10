import PatternMatching from './PatternMatching'

function PatternMatchingBabelPlugin({types}) {
    return {
        visitor: {
            ClassDeclaration(node, parent) {
                const patternMatching = new PatternMatching(types)
                patternMatching.run(node)
            }
        }
    }
}

export * from './decorators'
export default PatternMatchingBabelPlugin
