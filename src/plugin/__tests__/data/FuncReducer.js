function reducer4(a: A, action: AnyAction, b: B): A {
    babelPatternMatch(action, {
        addMultiple(a: A, action: TodoAddMultipleAction, b: B): A {
            return a
        }
    })
    return a
}
