import type {ReducerFn} from '../../../decorators'
import {generateReducer} from '../../../decorators'

type Todos = Object
class TodoAddMultipleAction {}
class TodoAddMultipleErrorAction {}
class TodoAddErrorAction {}
class TodoCompleteErrorAction {}
class TodoDestroyErrorAction {}

class ExampleReducer {
    @generateReducer(1)
    reducer: ReducerFn<Todos>;

    addMultiple(todos: Todos, action: TodoAddMultipleAction): Todos {
        return todos
    }

    addError(todos: Todos,
        {error}: TodoAddMultipleErrorAction
            | TodoAddErrorAction
            | TodoCompleteErrorAction
            | TodoDestroyErrorAction
    ): Todos {
        return todos
    }
}
