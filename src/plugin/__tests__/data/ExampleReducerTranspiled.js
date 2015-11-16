import { babelPatternMatch } from '../../../expr';

class Action {}
class TodoAddMultipleAction extends Action {}
class TodoAddMultipleErrorAction extends Action {}
class TodoAddErrorAction extends Action {}
class TodoCompleteErrorAction extends Action {}
class TodoDestroyErrorAction extends Action {}

class A {}
class B {}

type AnyAction = Object & Action;

class ExampleReducer {
    reduce(a: A, action: AnyAction, b: B): A {
        switch (action.constructor) {
            case TodoAddMultipleAction:
                return this.addMultiple(a, action, b);

            case TodoAddMultipleErrorAction:
            case TodoAddErrorAction:
            case TodoCompleteErrorAction:
            case TodoDestroyErrorAction:
                return this.addError(a, action, b);

            default:
                break;
        }

        return a;
    }

    addMultiple(a: A, action: TodoAddMultipleAction, b: B): A {
        return a;
    }

    addError(a: A, { error }: TodoAddMultipleErrorAction | TodoAddErrorAction | TodoCompleteErrorAction | TodoDestroyErrorAction, b: B): A {
        return a;
    }
}