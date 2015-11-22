export const findReducerExpressionVisitor = {
    ExpressionStatement(path, state) {
        const expr = path.node.expression
        if (expr.type === 'CallExpression' && expr.callee.name === state.reducerLabel) {
            state.expressionParentPath = path
            state.expression = expr
        }
    }
}

const findReducerPropertyVisitor = {
    'ClassMethod|ObjectMethod|FunctionDeclaration'(path, state) {
        const propState = {
            reducerLabel: state.reducerLabel,
            expressionParentPath: null,
            expression: null
        }
        path.traverse(findReducerExpressionVisitor, propState)
        if (propState.expression) {
            state.prop = path
            state.expressionParentPath = propState.expressionParentPath
            state.expression = propState.expression
        }
    }
}

export default findReducerPropertyVisitor
