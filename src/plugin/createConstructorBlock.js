import generateSwitchCase from './generateSwitchCase'

export default function createConstructorBlock({t, typesMap, reducerRef, newReducerFnId, thisRef}) {
    const thisReducerRef = t.memberExpression(t.thisExpression(), reducerRef)
    const stateId = t.identifier('state')
    const actionId = t.identifier('action')

    return [
        t.variableDeclaration('const', [
            t.variableDeclarator(thisRef, t.thisExpression())
        ]),
        t.expressionStatement(
            t.assignmentExpression(
                '=',
                thisReducerRef,
                t.functionExpression(
                    newReducerFnId,
                    [stateId, actionId],
                    generateSwitchCase({
                        t,
                        typesMap,
                        thisRef,
                        stateId,
                        actionId
                    })
                )
            )
        )
    ]
}
