const findReducerExpressionVisitor = {
    ExpressionStatement(path, state) {
        const expr = path.node.expression
        if (expr.callee.name === state.reducerLabel) {
            state.expressionParentPath = path
            state.expression = expr
        }
    }
}

const findReducerPropertyVisitor = {
    'ClassMethod|ObjectMethod'(path, state) {
        const propState = {
            reducerLabel: state.reducerLabel,
            expressionParentPath: null,
            expression: null
        }
        if (!path.node) {
            return
        }
        path.traverse(findReducerExpressionVisitor, propState)
        if (propState.expression) {
            state.prop = path.node
            state.expressionParentPath = propState.expressionParentPath
            state.expression = propState.expression
        }
    }
}

export default findReducerPropertyVisitor
