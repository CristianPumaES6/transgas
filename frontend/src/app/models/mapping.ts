// 
export class Mapping {
    constructor(
        public key?: number,
        public value?: number
    ) {
        this.key = key || 0;
        this.value = value || 0;
    }

    public searchKey(mappings: Mapping[], key: number): Mapping {
        return mappings.find(mapping => mapping.key == key);
    }

}