function extractOptionsFromDecorators(decorators, decoratorName) {
    return decorators.reduce((rec, decorator) => {
        if (decorator.expression.callee.name === decoratorName) {
            decorator.expression.arguments.forEach(args => {
                (args.properties || []).forEach(arg => {
                    rec.hasDecorator = true
                    rec.options[arg.key.name] = arg.value.value
                })
            })
        } else {
            rec.normalDecorators.push(decorator)
        }
        return rec
    }, {
        normalDecorators: [],
        options: {},
        hasDecorator: false
    })
}

class PatternMatching {
    constructor(types, decoratorName = 'reflectActions') {
        this.types = types
        this._decoratorName = decoratorName
    }

    run(path) {
        const target = path.node.body
        const decoratorInfo = target.body
            .reduce((acc, node) => {
                const {options, normalDecorators, hasDecorator} = extractOptionsFromDecorators(node.decorators || [], this._decoratorName)
                if (hasDecorator) {
                    return {node, options, normalDecorators}
                }

                return acc
            }, {
                node: null,
                options: {},
                normalDecorators: []
            })

        if (decoratorInfo.node) {
            const typesMap = target.body
                .reduce((acc, node) => {
                    if (node !== decoratorInfo.node && node.kind === 'method') {
                        return acc.concat(this._getTypes(node, decoratorInfo.options))
                    }
                    return acc
                }, [])

            if (typesMap.length) {
                const de = this._generateMap(typesMap)
                // console.log(111,
                //     decoratorInfo.node.body.body[0].argument.elements[0].elements,
                //     222,
                //     de.body[0].argument.elements[0].elements
                // )
                decoratorInfo.node.decorators = decoratorInfo.normalDecorators
                decoratorInfo.node.body = de
            }
        }
    }

    _generateMap(typesMap) {
        const t = this.types
        return t.blockStatement([t.returnStatement(this._createMapExpression(typesMap))])
    }

    _createMapExpression(typesMap) {
        const t = this.types
        return t.arrayExpression(typesMap.map(({type, method}) =>
            t.arrayExpression([
                t.identifier(type),
                t.memberExpression(
                    t.thisExpression(),
                    t.identifier(method)
                )
            ])
        ))
    }

    _extractTypeNames(typeAnnotation) {
        let result = []
        switch (typeAnnotation.type) {
            case 'GenericTypeAnnotation':
                result.push(typeAnnotation.id.name)
                break
            case 'UnionTypeAnnotation':
                typeAnnotation.types.forEach(type => {
                    result = result.concat(this._extractTypeNames(type))
                })
                break
            default:
        }
        return result
    }

    _getTypes(parentNode, {argName}) {
        return parentNode.params.reduce((acc, node) => {
            if (node.typeAnnotation.type === 'TypeAnnotation'
                && node.name === argName
            ) {
                const typeAnnotation = node.typeAnnotation.typeAnnotation
                const records = this._extractTypeNames(typeAnnotation).map(annotationName => {
                    return {type: annotationName, method: parentNode.key.name}
                })
                return acc.concat(records)
            }
            return acc
        }, [])
    }

}

export default PatternMatching
