"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateActivity = void 0;
function translateActivity(text) {
    switch (text) {
        case 'LOADING':
            return 'Loading';
            break;
        case 'DOWNLOADING':
            return 'Discharge';
            break;
        case 'BALLAST':
            return 'S. Ballast';
            break;
        case 'LADEN':
            return 'S. Laden';
            break;
        case 'ECONOMICAL':
            return 'S. Economical';
            break;
        case 'ANCHORED':
            return 'Anchored';
            break;
        case 'MANEUVER':
            return 'Maneuver';
            break;
        case 'OTHER':
            return 'Other Act';
            break;
        case 'OTHER_ACT':
            return 'Other Act';
            break;
        case 'SAILING_IN_BALLAST':
            return 'S. Ballast';
            break;
        case 'SAILING_WITH_LADEN':
            return 'S. Laden';
            break;
        case 'ECONOMICAL_NAVIGATION':
            return 'S. Economical';
            break;
        default:
            break;
    }
}
exports.translateActivity = translateActivity;
//# sourceMappingURL=translate.assets.js.map