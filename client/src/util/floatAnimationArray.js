

export function getFloatArray(length) {
    let arr = []
    for(let i=0; i< length; i++) {
        const rand = Math.random()
        rand >= 0.5 ?
        arr.push(6)
        :
        arr.push(-6)
    }

    return arr
}