// 
export class Mapping {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.key = key || 0;
        this.value = value || 0;
    }
}
export function searchKey(mappings, key) {
    return mappings.find(mapping => Number(mapping.key) == Number(key));
}
//# sourceMappingURL=mapping.js.map