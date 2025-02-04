"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const app_gateway_1 = require("./app.gateway");
const socketEmit_1 = require("./models/socketEmit");
const consumption_equipment_service_1 = require("./components/oils/consumption-equipment/consumption-equipment.service");
const promises_assets_1 = require("./assets/promises.assets");
const users_service_1 = require("./components/users/users.service");
let AppService = class AppService {
    constructor(gateway, _ConsumptionEquipmentService, _UsersService) {
        this.gateway = gateway;
        this._ConsumptionEquipmentService = _ConsumptionEquipmentService;
        this._UsersService = _UsersService;
    }
    EmitConnect() {
        let socketEmitModel = new socketEmit_1.SocketEmitModel();
        socketEmitModel.action = 'WHO_ARE_CONNECTED';
        this.gateway.wss.emit('EmitConnect', socketEmitModel);
        return true;
    }
    ListConsumptionLubricantPerMonth(userid, startDate, endDate) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            return this._UsersService.Gets({
                id: userid,
                role: 'BUQUE',
            });
        })
            .then(result => {
            return this.ConsumptionLubricantPerMonthPerListUsers(result, startDate, endDate);
        });
    }
    GetOilAnalysis(buqueId, ETM_OilAnalysis_Oid) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            return this._ConsumptionEquipmentService.QueryGetTask(buqueId, ETM_OilAnalysis_Oid);
        })
            .then(result => {
            return result;
        })
            .catch(result => {
            return [];
        });
    }
    SaveFileAnalysisOil(buqueId, ETM_OilAnalysis_Oid) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            return this._ConsumptionEquipmentService.ViewFileAnalysisOil(buqueId, ETM_OilAnalysis_Oid);
        })
            .then((result) => {
            return result;
        })
            .catch(result => {
            return [];
        });
    }
    ViewFileAnalysisOil(buqueId, ETM_OilAnalysis_Oid) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            return this._ConsumptionEquipmentService.ViewFileAnalysisOil(buqueId, ETM_OilAnalysis_Oid);
        })
            .then((result) => {
            return result;
        })
            .catch(result => {
            return [];
        });
    }
    consultEquipmentConsumptionByMonthUser(userId, entityEquipmentId, DateYEAR_MONTH) {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            return this._ConsumptionEquipmentService.consultEquipmentConsumptionByMonthUser(userId, entityEquipmentId, DateYEAR_MONTH);
        })
            .then(result => {
            return result;
        })
            .catch(result => {
            return [];
        });
    }
    GetShips() {
        return (0, promises_assets_1.DummyPromise)()
            .then(result => {
            return this._ConsumptionEquipmentService.GetShips();
        })
            .then(result => {
            return result;
        })
            .catch(result => {
            return [];
        });
    }
    async ConsumptionLubricantPerMonthPerListUsers(users, startDate, endDate) {
        var _a, e_1, _b, _c;
        let returnDashboardLubricant = [];
        try {
            for (var _d = true, users_1 = __asyncValues(users), users_1_1; users_1_1 = await users_1.next(), _a = users_1_1.done, !_a; _d = true) {
                _c = users_1_1.value;
                _d = false;
                const itemUser = _c;
                let DashboardListMonthLubricant = {};
                DashboardListMonthLubricant.userId = itemUser.id;
                DashboardListMonthLubricant.userName = itemUser.name;
                DashboardListMonthLubricant.filename = itemUser.filename;
                DashboardListMonthLubricant.role = itemUser.role;
                DashboardListMonthLubricant.getOilConsumptionPerMonth = await this._ConsumptionEquipmentService.getOilConsumptionPerMonth(itemUser.id, startDate, endDate);
                returnDashboardLubricant.push(DashboardListMonthLubricant);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = users_1.return)) await _b.call(users_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return returnDashboardLubricant;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_gateway_1.AppGateway,
        consumption_equipment_service_1.ConsumptionEquipmentService,
        users_service_1.UsersService])
], AppService);
//# sourceMappingURL=app.service.js.map