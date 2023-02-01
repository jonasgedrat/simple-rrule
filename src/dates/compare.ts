export const isBefore = (firstDate: Date, lastDate: Date): boolean => {
    return firstDate.getTime() <= lastDate.getTime()
}
