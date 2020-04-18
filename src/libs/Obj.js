export function GetNum(aObj,aKey,aDefault) {
    if (aObj.hasOwnProperty(aKey)) {
        return aObj[aKey]
    } else {
        return aDefault || 0
    }
}

export function GetStr(aObj,aKey,aDefault) {
    if (aObj.hasOwnProperty(aKey)) {
        return aObj[aKey]
    } else {
        return aDefault || ""
    }
}

export function Get(aObj,aKey,aDefault) {
    if (aObj.hasOwnProperty(aKey)) {
        return aObj[aKey]
    } else {
        return aDefault
    }
}

export function AffirmFields(aObj,aObjWithDefault) {
    for (let key in aObjWithDefault) {
        if (!aObj.hasOwnProperty(key)) {
            aObj[key] = aObjWithDefault[key];
        }
    }
}
