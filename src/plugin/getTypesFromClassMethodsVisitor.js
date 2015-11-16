
function extractTypeNames(typeAnnotation) {
    let result = []
    switch (typeAnnotation.type) {
        case 'GenericTypeAnnotation':
            result.push(typeAnnotation.id.name)
            break
        case 'UnionTypeAnnotation':
            typeAnnotation.types.forEach(type => {
                result = result.concat(extractTypeNames(type))
            })
            break
        default:
    }
    return result
}

const getTypesFromClassMethodsVisitor = {
    'ObjectMethod|ClassMethod'(path, state) {
        const node = path.node
        if (node === state.skipProp) {
            return
        }
        const params = node.params
        const key = node.key
        const param = params[state.argNum]
        if (key.name[0] !== '_' && param) {
            state.types.push({
                types: extractTypeNames(param.typeAnnotation.typeAnnotation),
                method: node.key.name
            })
        }
    }
}

export default getTypesFromClassMethodsVisitor
