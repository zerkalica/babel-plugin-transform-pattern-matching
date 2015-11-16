import findReducerPropertyVisitor from './findReducerPropertyVisitor'
import getTypesFromClassMethodsVisitor from './getTypesFromClassMethodsVisitor'
import generateSwitchCase from './generateSwitchCase'

export default function patternMatchingBabelPlugin({types: t}) {
    return {
        visitor: {
            ClassDeclaration(path) {
                const {node, scope} = path
                const state = {
                    reducerLabel: 'babelPatternMatch',
                    prop: null,
                    expressionParentPath: null,
                    expression: null
                }
                path.traverse(findReducerPropertyVisitor, state)

                if (!state.prop || !state.expression) {
                    return
                }

                const [switchArg, thisRef] = state.expression.arguments
                const args = state.prop.params
                const argNum = args.findIndex(({name}) => name === switchArg.name)

                const typesState = {
                    types: [],
                    skipProp: state.prop,
                    argNum
                }
                path.traverse(getTypesFromClassMethodsVisitor, typesState)
                const switchCase = generateSwitchCase({
                    args,
                    switchArg,
                    t,
                    thisRef: thisRef || t.thisExpression(),
                    typesMap: typesState.types
                })
                state.expressionParentPath.replaceWith(switchCase)
            }
        }
    }
}
