import type { ReducerFn } from '../../../decorators';
import { generateReducer } from '../../../decorators';

type Todos = Object;
class TodoAddMultipleAction {}
class TodoAddMultipleErrorAction {}
class TodoAddErrorAction {}
class TodoCompleteErrorAction {}
class TodoDestroyErrorAction {}

class ExampleReducer {
    constructor() {
        const _this = this;

        this.reducer = function _ExampleReducer(state, action) {
            switch (action.constructor) {
                case TodoAddMultipleAction:
                    return _this.addMultiple(state, action);

                case TodoAddMultipleErrorAction:
                case TodoAddErrorAction:
                case TodoCompleteErrorAction:
                case TodoDestroyErrorAction:
                    return _this.addError(state, action);

                default:
                    return state;
            }
        };
    }

    reducer: ReducerFn<Todos>;

    addMultiple(todos: Todos, action: TodoAddMultipleAction): Todos {
        return todos;
    }

    addError(todos: Todos, { error }: TodoAddMultipleErrorAction | TodoAddErrorAction | TodoCompleteErrorAction | TodoDestroyErrorAction): Todos {
        return todos;
    }
}