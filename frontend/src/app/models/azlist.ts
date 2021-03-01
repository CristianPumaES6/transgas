// Interface del conponente azList
export class SettingAzList {

    constructor(
        public azListBreadcrumbs?: string[],
        public titleAzLists?: string,
        public isNew?: boolean,
        public isBack?: boolean,
        public toolTipNew?: string,
        public toolTipBack?: string,
        public activateDropDown?: boolean,
        public placeholderDropdown?: string,
        public activateOptionDelete?: boolean,
        public toolTipOptionDelete?: string,
        // Select Item
        public activateSelectItemEmit2?: Boolean,
        public toolTipSelectItemEmit2?: string,
        public iconSelectItemEmit2?: string,
        public dataSelectItemEmit2?: string,
        public activateSelectItemEmit3?: Boolean,
        public toolTipSelectItemEmit3?: string,
        public iconSelectItemEmit3?: string,
        public dataSelectItemEmit3?: string,

    ) {
        this.azListBreadcrumbs = azListBreadcrumbs || [];
        this.titleAzLists = titleAzLists || '';
        this.isNew = isNew || false;
        this.isBack = isBack || false;
        this.toolTipNew = toolTipNew || 'New';
        this.toolTipBack = toolTipBack || 'Back';
        this.activateDropDown = activateDropDown || false;
        this.placeholderDropdown = placeholderDropdown || '';
        this.activateOptionDelete = activateOptionDelete || false;
        this.toolTipOptionDelete = toolTipOptionDelete || '';
        this.activateSelectItemEmit2 = activateSelectItemEmit2 || false;
        this.toolTipSelectItemEmit2 = toolTipSelectItemEmit2 || '';
        this.iconSelectItemEmit2 = iconSelectItemEmit2 || '';
        this.dataSelectItemEmit2 = dataSelectItemEmit2 || '';
        this.activateSelectItemEmit3 = activateSelectItemEmit3 || false;
        this.toolTipSelectItemEmit3 = toolTipSelectItemEmit3 || '';
        this.iconSelectItemEmit3 = iconSelectItemEmit3 || '';
        this.dataSelectItemEmit3 = dataSelectItemEmit3 || '';
    }

}

export class azListDropdown {
    constructor(
        public id?: number,
        public name?: string,
    ) {
        this.id = id || null;
        this.name = name || '';
    }
}

export class AzList {
    constructor(
        public id?: number,
        public name?: string,
        public surname?: string,
        public image?: string,
        public item2?: string,
        public item3?: string
    ) {
        this.id = id || null;
        this.name = name || '';
        this.surname = surname || '';
        this.image = image || '';
        this.item2 = item2 || '';
        this.item3 = item3 || '';
    }
}
