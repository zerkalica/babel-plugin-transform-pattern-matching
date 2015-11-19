import findReducerPropertyVisitor, {findReducerExpressionVisitor} from './findReducerPropertyVisitor'
import getTypesFromClassMethodsVisitor from './getTypesFromClassMethodsVisitor'
import generateSwitchCase from './generateSwitchCase'

export default function patternMatchingBabelPlugin({types: t}) {
    return {
        visitor: {
            'ClassDeclaration|ObjectExpression|Program'(path) {
                const state = {
                    reducerLabel: 'babelPatternMatch',
                    parent: path.isProgram() ? path.node : null,
                    prop: null,
                    expressionParentPath: null,
                    expression: null
                }
                path.traverse(findReducerPropertyVisitor, state)
                if (!state.expression) {
                    return
                }
                const {prop, expression} = state
                const args = prop.node.params
                const [switchArg, container] = expression.arguments
                const argNum = args.findIndex(({name}) => name === switchArg.name)
                const typesState = {
                    types: [],
                    skipProp: prop.node,
                    argNum
                }
                path.traverse(getTypesFromClassMethodsVisitor, typesState)

                let thisRef
                if (path.isProgram()) {
                    thisRef = path.scope.generateUidIdentifier(prop.node.id.name)
                    prop.insertBefore(
                        t.variableDeclaration('const', [t.variableDeclarator(thisRef, container)])
                    )
                } else if (path.isObjectExpression()) {
                    thisRef = container || path.parent.id
                } else if (path.isClassDeclaration()) {
                    thisRef = container || (
                        prop.node.static ? path.node.id : t.thisExpression()
                    )
                }

                const switchCase = generateSwitchCase({
                    args,
                    switchArg,
                    t,
                    thisRef,
                    typesMap: typesState.types
                })
                state.expressionParentPath.replaceWith(switchCase)
            }
        }
    }
}
