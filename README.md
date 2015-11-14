babel-plugin-transform-pattern-matching
=======================================

Generate switch/case structure from class method type annotation. Usable with flowtype and redux.

Transform code like this:

```js
import {generateReducer} from 'babel-plugin-transform-pattern-matching/decorators'
import type {ReducerFn} from 'babel-plugin-transform-pattern-matching/decorators'

class Todos {
    items: Array<{id: string, title: string}>;
    error: string;
}

class TodoReducer {
    @generateReducer(1)
    reducer: ReducerFn<Todos>;

    add(todos: Todos, {id, title}: TodoAddAction): Todos {
        todos.items.push({id, title})
        return todos
    }

    error(todos: Todos, {error}: TodoAddErrorAction | TodoRemoveErrorAction): Todos {
        todos.error = error
        return todos
    }
}

export default new TodoReducer().reducer
```

to this:

```js
import {generateReducer} from 'babel-plugin-transform-pattern-matching/decorators'
import type {ReducerFn} from 'babel-plugin-transform-pattern-matching/decorators'

class Todos {
    items: Array<{id: string, title: string}>;
    error: string;
}

class TodoReducer {
    reducer: ReducerFn<Todos>;

    constructor() {
        const _this = this
        this.reducer = function _TodoReducer(state, action) {
            switch (action.constructor) {
                case TodoAddAction:
                    return _this.add(state, action)
                case TodoAddErrorAction:
                case TodoRemoveErrorAction:
                    return _this.error(state, action)
                default:
                    return state
            }
        }
    }

    add(todos: Todos, {id, title}: TodoAddAction): Todos {
        todos.items.push({id, title})
        return todos
    }

    error(todos: Todos, {error}: TodoAddErrorAction | TodoRemoveErrorAction): Todos {
        todos.error = error
        return todos
    }
}

export default new TodoReducer().reducer
```
