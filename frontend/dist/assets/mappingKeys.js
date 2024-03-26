"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchKey = exports.Mapping = void 0;
class Mapping {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.key = key || 0;
        this.value = value || 0;
    }
}
exports.Mapping = Mapping;
function searchKey(mappings, key) {
    return mappings.find(mapping => Number(mapping.key) == Number(key));
}
exports.searchKey = searchKey;
//# sourceMappingURL=mappingKeys.js.map