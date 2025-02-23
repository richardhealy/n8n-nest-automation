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
exports.TemplatePresetService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const whatsapp_template_1 = require("../templates/whatsapp.template");
const openai_template_1 = require("../templates/openai.template");
const google_calendar_template_1 = require("../templates/google-calendar.template");
const email_automation_template_1 = require("../templates/email-automation.template");
let TemplatePresetService = class TemplatePresetService {
    constructor(prisma) {
        this.prisma = prisma;
        this.presets = {
            whatsapp: whatsapp_template_1.whatsappTemplate,
            openai: openai_template_1.openaiTemplate,
            googleCalendar: google_calendar_template_1.googleCalendarTemplate,
            emailAutomation: email_automation_template_1.emailAutomationTemplate,
        };
    }
    async createFromPreset(user, presetName, name, description) {
        const preset = this.presets[presetName];
        if (!preset) {
            throw new Error(`Preset ${presetName} not found`);
        }
        return this.prisma.template.create({
            data: {
                name,
                description,
                config: preset,
                tags: [presetName],
                userId: user.id,
                organizationId: user.organizationId,
            },
        });
    }
    getAvailablePresets() {
        return Object.keys(this.presets);
    }
};
exports.TemplatePresetService = TemplatePresetService;
exports.TemplatePresetService = TemplatePresetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TemplatePresetService);
//# sourceMappingURL=template-preset.service.js.map