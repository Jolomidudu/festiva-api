"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestsModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const guests_controller_1 = require("./guests.controller");
const guests_service_1 = require("./guests.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let GuestsModule = class GuestsModule {
};
exports.GuestsModule = GuestsModule;
exports.GuestsModule = GuestsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({ secret: process.env.JWT_SECRET ?? "change-me" })
        ],
        controllers: [guests_controller_1.GuestsController],
        providers: [guests_service_1.GuestsService, jwt_auth_guard_1.JwtAuthGuard]
    })
], GuestsModule);
//# sourceMappingURL=guests.module.js.map