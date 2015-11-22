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

const Reducer1 = {
    reduce(a: A, action: AnyAction, b: B): A {
        babelPatternMatch(action)
        return a
    },

    addMultiple(a: A, action: TodoAddMultipleAction, b: B): A {
        return a
    },

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

class Reducer2 {
    static reduce(a: A, action: AnyAction, b: B): A {
        babelPatternMatch(action)
        return a
    }

    static addMultiple(a: A, action: TodoAddMultipleAction, b: B): A {
        return a
    }
}

class Reducer3 {
    reduce(a: A, action: AnyAction, b: B): A {
        babelPatternMatch(action)
        return a
    }

    addMultiple(a: A, action: TodoAddMultipleAction, b: B): A {
        return a
    }
}
/*
function reducer4(a: A, action: AnyAction, b: B): A {
    babelPatternMatch(action, {
        addMultiple(a: A, action: TodoAddMultipleAction, b: B): A {
            return a
        }
    })
    return a
}
*/
const reducer3 = new Reducer3()
export default {
    reducer1: Reducer1.reduce,
    reducer2: Reducer2.reduce,
    reducer3: reducer3.reduce.bind(reducer3)
//    reducer4: reducer4
}
