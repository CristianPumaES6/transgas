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
        public activateOptionDelete?: boolean
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
    ) {
        this.id = id || null;
        this.name = name || '';
        this.surname = surname || '';
        this.image = image || '';
    }
}
