import findReducerPropertyVisitor from './findReducerPropertyVisitor'
import getTypesFromClassMethodsVisitor from './getTypesFromClassMethodsVisitor'
import createConstructorBlock from './createConstructorBlock'
import createNewConstructor from './createNewConstructor'

export default function patternMatchingBabelPlugin({types: t}) {
    return {
        visitor: {
            ClassDeclaration(path) {
                const {node, scope} = path
                const state = {
                    reducerLabel: 'generateReducer',
                    argNum: null,
                    prop: null,
                    decoratorPath: null,
                    constr: null
                }
                path.traverse(findReducerPropertyVisitor, state)

                if (!state.prop) {
                    return
                }

                const typesState = {
                    types: [],
                    argNum: state.argNum
                }
                path.traverse(getTypesFromClassMethodsVisitor, typesState)

                if (typesState.types.length) {
                    const constructorBlock = createConstructorBlock({
                        t,
                        typesMap: typesState.types,
                        reducerRef: state.prop.key,
                        newReducerFnId: scope.generateUidIdentifier(node.id.name),
                        thisRef: scope.generateUidIdentifier('this')
                    })

                    if (state.constr) {
                        const ConstrBody = state.constr.body
                        ConstrBody.body = ConstrBody.body.concat(constructorBlock)
                    } else {
                        const {body} = node
                        body.body = [
                            createNewConstructor({t, constructorBlock})
                        ].concat(body.body)
                    }
                }
                state.decoratorPath.remove()
            }
        }
    }
}
