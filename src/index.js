import ReduxPatternMatching from './redux-pattern-matching'

function ReduxPatternMatchingBabelPlugin({types}) {
    return {
        visitor: {
            ClassDeclaration(node, parent) {
                const reduxPatternMatching = new ReduxPatternMatching(types)
                reduxPatternMatching.run(node)
            }
        }
    }
}

export default ReduxPatternMatchingBabelPlugin
