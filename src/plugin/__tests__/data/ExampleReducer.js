import {babelPatternMatch} from '../../../expr'

class Action {}
class TodoAddMultipleAction extends Action {}
class TodoAddMultipleErrorAction extends Action {}
class TodoAddErrorAction extends Action {}
class TodoCompleteErrorAction extends Action {}
class TodoDestroyErrorAction extends Action {}

class A {}
class B {}

type AnyAction = Object & Action

class ExampleReducer {
    reduce(a: A, action: AnyAction, b: B): A {
        babelPatternMatch(action)
        return a
    }

    addMultiple(a: A, action: TodoAddMultipleAction, b: B): A {
        return a
    }

    addError(
        a: A,
        {error}: TodoAddMultipleErrorAction
            | TodoAddErrorAction
            | TodoCompleteErrorAction
            | TodoDestroyErrorAction,
        b: B
    ): A {
        return a
    }
}
