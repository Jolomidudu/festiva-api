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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventPreferencesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const event_preferences_service_1 = require("./event-preferences.service");
const update_event_preferences_dto_1 = require("./dto/update-event-preferences.dto");
let EventPreferencesController = class EventPreferencesController {
    constructor(preferencesService) {
        this.preferencesService = preferencesService;
    }
    getPreferences(req, eventId) {
        return this.preferencesService.getPreferences(req.user.sub, eventId);
    }
    updatePreferences(req, eventId, dto) {
        return this.preferencesService.updatePreferences(req.user.sub, eventId, dto);
    }
};
exports.EventPreferencesController = EventPreferencesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EventPreferencesController.prototype, "getPreferences", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("eventId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_event_preferences_dto_1.UpdateEventPreferencesDto]),
    __metadata("design:returntype", void 0)
], EventPreferencesController.prototype, "updatePreferences", null);
exports.EventPreferencesController = EventPreferencesController = __decorate([
    (0, common_1.Controller)("events/:eventId/preferences"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [event_preferences_service_1.EventPreferencesService])
], EventPreferencesController);
//# sourceMappingURL=event-preferences.controller.js.map