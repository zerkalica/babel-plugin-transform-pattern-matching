export function reflectActions(param) {
    return function _reflectActions(target, key, descriptor) {
        throw new Error('Not for run-time, only for babel transform')
    }
}
