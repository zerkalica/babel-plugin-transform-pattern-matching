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
                        acc.push(this._getTypes(node, decoratorInfo.options))
                    }
                    return acc
                }, [])

            if (typesMap.length) {
                decoratorInfo.node.decorators = decoratorInfo.normalDecorators.length
                    ? decoratorInfo.normalDecorators
                    : undefined

                const de = this._generateMap(typesMap, decoratorInfo.options)
                // console.log(111, decoratorInfo.node.body.body[0].cases)
                decoratorInfo.node.body = de
            }
        }
    }

    _generateCase({types, method, argName, resultName}) {
        const t = this.types

        return types.map((type, index) => {
            const ret = []
            if (index === types.length - 1) {
                ret.push(t.returnStatement(
                    t.callExpression(
                        t.memberExpression(t.thisExpression(), t.identifier(method)), [
                            t.identifier(resultName),
                            t.identifier(argName)
                        ]
                    )
                ))
            }
            return t.switchCase(t.identifier(type), ret)
        })
    }

    _generateMap(typesMap, {argName, resultName}) {
        const t = this.types
        return t.blockStatement([
            t.switchStatement(
                t.memberExpression(t.identifier(argName), t.identifier('constructor')),
                typesMap.reduce((cases, {types, method}) => {
                    return cases.concat(this._generateCase({
                        argName,
                        resultName,
                        types,
                        method
                    }))
                }, []).concat([
                    t.switchCase(null, [t.returnStatement(t.identifier(resultName))])
                ])
            )
        ])
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
                return {
                    types: this._extractTypeNames(node.typeAnnotation.typeAnnotation),
                    method: parentNode.key.name
                }
            }
            return acc
        }, null)
    }

}

export default PatternMatching
