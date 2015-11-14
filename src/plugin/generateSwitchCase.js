function generateCase({t, types, actionId, stateId, thisRef, method}) {
    return types.map((type, index) => {
        const ret = []
        if (index === types.length - 1) {
            ret.push(t.returnStatement(
                t.callExpression(
                    t.memberExpression(thisRef, t.identifier(method)), [
                        stateId,
                        actionId
                    ]
                )
            ))
        }
        return t.switchCase(t.identifier(type), ret)
    })
}

export default function generateSwitchCase({t, typesMap, thisRef, stateId, actionId}) {
    return t.blockStatement([
        t.switchStatement(
            t.memberExpression(actionId, t.identifier('constructor')),
            typesMap.reduce((cases, {types, method}) => {
                return cases.concat(generateCase({
                    t,
                    actionId,
                    stateId,
                    types,
                    method,
                    thisRef
                }))
            }, []).concat([
                t.switchCase(null, [t.returnStatement(stateId)])
            ])
        )
    ])
}
