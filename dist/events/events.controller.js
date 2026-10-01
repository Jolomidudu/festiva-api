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
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const create_event_dto_1 = require("./dto/create-event.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const create_schedule_item_dto_1 = require("./dto/create-schedule-item.dto");
const update_schedule_item_dto_1 = require("./dto/update-schedule-item.dto");
let EventsController = class EventsController {
    constructor(events) {
        this.events = events;
    }
    create(user, dto) {
        return this.events.create(user.sub, dto);
    }
    findMine(user) {
        return this.events.findMine(user.sub);
    }
    findOne(user, id) {
        return this.events.findOne(user.sub, id);
    }
    update(user, id, dto) {
        return this.events.update(user.sub, id, dto);
    }
    remove(user, id) {
        return this.events.remove(user.sub, id);
    }
    findSchedule(user, eventId) {
        return this.events.findSchedule(user.sub, eventId);
    }
    createScheduleItem(user, eventId, dto) {
        return this.events.createScheduleItem(user.sub, eventId, dto);
    }
    updateScheduleItem(user, eventId, scheduleItemId, dto) {
        return this.events.updateScheduleItem(user.sub, eventId, scheduleItemId, dto);
    }
    removeScheduleItem(user, eventId, scheduleItemId) {
        return this.events.removeScheduleItem(user.sub, eventId, scheduleItemId);
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_event_dto_1.CreateEventDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(":eventId/schedule"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "findSchedule", null);
__decorate([
    (0, common_1.Post)(":eventId/schedule"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("eventId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_schedule_item_dto_1.CreateScheduleItemDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "createScheduleItem", null);
__decorate([
    (0, common_1.Patch)(":eventId/schedule/:scheduleItemId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("eventId")),
    __param(2, (0, common_1.Param)("scheduleItemId")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, update_schedule_item_dto_1.UpdateScheduleItemDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "updateScheduleItem", null);
__decorate([
    (0, common_1.Delete)(":eventId/schedule/:scheduleItemId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("eventId")),
    __param(2, (0, common_1.Param)("scheduleItemId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "removeScheduleItem", null);
exports.EventsController = EventsController = __decorate([
    (0, common_1.Controller)("events"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map