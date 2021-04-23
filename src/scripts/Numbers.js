export function formatNumber(n) {
    /*
        - Convert a number like 12345 to 123.5K
    */
    if (n < 1e3) return n
    else if (n < 1e6) return + (n / 1e3).toFixed(1) + "k"
    else if (n < 1e9) return + (n / 1e6).toFixed(1) + "M"
    else if (n < 1e12) return + (n / 1e9).toFixed(1) + "B"
    else if (n < 1e12) return + (n / 1e12).toFixed(1) + "T"
}


export function formatUnit(unit, n) {
    /*
        - input unit should be with respect to one unit (1 reply -> n replies)
    */
    const hasSuffixY = unit[unit.length - 1] === 'y'
    if (n === 1) {
        return unit
    } else {
        return hasSuffixY ? unit.slice(0, -1) + 'ies' : unit + 's'
    }
}