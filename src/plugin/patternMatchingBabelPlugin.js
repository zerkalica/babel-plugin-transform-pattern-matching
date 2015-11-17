import findReducerPropertyVisitor from './findReducerPropertyVisitor'
import getTypesFromClassMethodsVisitor from './getTypesFromClassMethodsVisitor'
import generateSwitchCase from './generateSwitchCase'

export default function patternMatchingBabelPlugin({types: t}) {
    return {
        visitor: {
            'ClassDeclaration|ObjectExpression'(path) {
                const {node} = path
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

                let detectedThis
                if (path.isObjectExpression()) {
                    detectedThis = path.parent.id
                } else {
                    detectedThis = state.prop.static
                        ? node.id
                        : t.thisExpression()
                }

                const switchCase = generateSwitchCase({
                    args,
                    switchArg,
                    t,
                    thisRef: thisRef || detectedThis,
                    typesMap: typesState.types
                })
                state.expressionParentPath.replaceWith(switchCase)
            }
        }
    }
}
