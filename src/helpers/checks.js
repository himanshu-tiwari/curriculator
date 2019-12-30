export const isObject = obj => Boolean(
    obj && typeof(obj) === "object"
);

export const isArray = arr => Boolean(
    isObject(arr) &&
    arr instanceof Array
);

export const isNonEmptyArray = arr => Boolean(
    isArray(arr) &&
    arr.length > 0
);

export const isNumber = num => Boolean(
    typeof(num) === "number" &&
    !isNaN(num)
);

export const isNonEmptyString = str => Boolean(
    typeof(str) === "string" &&
    str.length > 0
);