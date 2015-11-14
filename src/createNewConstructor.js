export default function createNewConstructor({t, constructorBlock}) {
    return t.classMethod(
        'constructor',
        t.identifier('constructor'),
        [],
        t.blockStatement(constructorBlock)
    )
}
