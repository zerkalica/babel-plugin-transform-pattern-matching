function generateCase({
    args,
    method,
    t,
    thisRef,
    types
}) {
    return types.map((type, index) => {
        const ret = []
        if (index === types.length - 1) {
            ret.push(t.returnStatement(
                t.callExpression(
                    t.memberExpression(thisRef, t.identifier(method)), args)
            ))
        }
        return t.switchCase(t.identifier(type), ret)
    })
}

export default function generateSwitchCase({
    args,
    switchArg,
    t,
    thisRef,
    typesMap
}) {
    return t.switchStatement(
        t.memberExpression(switchArg, t.identifier('constructor')),
        typesMap.reduce((cases, {types, method}) => {
            return cases.concat(generateCase({
                args,
                method,
                t,
                thisRef,
                types
            }))
        }, []).concat([
            t.switchCase(null, [t.breakStatement()])
        ])
    )
}
