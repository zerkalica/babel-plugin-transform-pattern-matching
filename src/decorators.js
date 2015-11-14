export type Reducer<T> = (state: T, action: Object & Action) => T

type Descriptor = {
    enumerable: boolean,
    configurable: boolean,
    writable: boolean
}

type DecoratorFn = (target: Object, key: string, descriptor: Descriptor) => Descriptor;

export function generateReducer(argNum: number): DecoratorFn {
    return function _generateReducer(target: Object, key: string, descriptor: Descriptor): Descriptor {
        throw new Error('This ambient decorator only for babel-plugin-transform-pattern-matching')
    }
}
