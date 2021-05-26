export const generatePath = (str) => {
    return str ? str.trim().toLowerCase().split(' ').join('-') : ''
}