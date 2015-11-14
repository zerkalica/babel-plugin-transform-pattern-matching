
const findReducerDecoratorExpressionVisitor = {
    CallExpression(path, state) {
        const node = path.node
        if (
            node.callee.name === state.reducerLabel
            && node.arguments
            && node.arguments[0]
        ) {
            state.argNum = node.arguments[0].value
        }
    }
}

const findReducerDecoratorVisitor = {
    Decorator(path, state) {
        const exprState = {
            reducerLabel: state.reducerLabel,
            argNum: null
        }
        path.traverse(findReducerDecoratorExpressionVisitor, exprState)
        if (exprState.argNum) {
            state.argNum = exprState.argNum
            state.decoratorPath = path
        }
    }
}

const findReducerPropertyVisitor = {
    'ClassProperty|ClassMethod'(path, state) {
        const propState = {
            reducerLabel: state.reducerLabel,
            argNum: null,
            decoratorPath: null
        }
        path.traverse(findReducerDecoratorVisitor, propState)
        if (propState.argNum) {
            state.argNum = propState.argNum
            state.prop = path.node
            state.decoratorPath = propState.decoratorPath
        }
        if (path.node.kind === 'constructor') {
            state.constr = path.node
        }
    }
}

export default findReducerPropertyVisitor
