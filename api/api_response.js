export const success = data => {
    return {
        status: 1,
        outputData: data
    }
}

export const fail = err => {
    return {
        status: 0,
        outputData: err
    }
}
