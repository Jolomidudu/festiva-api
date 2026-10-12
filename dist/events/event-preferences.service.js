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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventPreferencesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EventPreferencesService = class EventPreferencesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verifyEventAccess(userId, eventId) {
        const member = await this.prisma.eventMember.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId,
                },
            },
            select: {
                id: true,
            },
        });
        if (!member) {
            throw new common_1.ForbiddenException("You do not have access to this event.");
        }
    }
    async getPreferences(userId, eventId) {
        await this.verifyEventAccess(userId, eventId);
        const event = await this.prisma.event.findUnique({
            where: {
                id: eventId,
            },
            select: {
                id: true,
            },
        });
        if (!event) {
            throw new common_1.NotFoundException("Event not found.");
        }
        return this.prisma.eventPreference.upsert({
            where: {
                eventId,
            },
            create: {
                eventId,
            },
            update: {},
        });
    }
    async updatePreferences(userId, eventId, dto) {
        await this.verifyEventAccess(userId, eventId);
        const event = await this.prisma.event.findUnique({
            where: {
                id: eventId,
            },
            select: {
                id: true,
            },
        });
        if (!event) {
            throw new common_1.NotFoundException("Event not found.");
        }
        const data = {};
        if (dto.timezone !== undefined) {
            data.timezone = dto.timezone;
        }
        if (dto.rsvpDeadline !== undefined) {
            data.rsvpDeadline =
                dto.rsvpDeadline === null
                    ? null
                    : new Date(dto.rsvpDeadline);
        }
        if (dto.allowPlusOne !== undefined) {
            data.allowPlusOne = dto.allowPlusOne;
        }
        if (dto.allowRsvpChanges !== undefined) {
            data.allowRsvpChanges = dto.allowRsvpChanges;
        }
        if (dto.showGuestContactInfo !== undefined) {
            data.showGuestContactInfo =
                dto.showGuestContactInfo;
        }
        if (dto.visibility !== undefined) {
            data.visibility = dto.visibility;
        }
        return this.prisma.eventPreference.upsert({
            where: {
                eventId,
            },
            create: {
                eventId,
                ...data,
            },
            update: data,
        });
    }
};
exports.EventPreferencesService = EventPreferencesService;
exports.EventPreferencesService = EventPreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventPreferencesService);
//# sourceMappingURL=event-preferences.service.js.map