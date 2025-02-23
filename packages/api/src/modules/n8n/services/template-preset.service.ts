import { Injectable } from '@nestjs/common';
import type { PrismaService } from '../../prisma/prisma.service';
import { whatsappTemplate } from '../templates/whatsapp.template';
import { openaiTemplate } from '../templates/openai.template';
import { googleCalendarTemplate } from '../templates/google-calendar.template';
import { emailAutomationTemplate } from '../templates/email-automation.template';
import type { User } from '@prisma/client';

@Injectable()
export class TemplatePresetService {
	private readonly presets = {
		whatsapp: whatsappTemplate,
		openai: openaiTemplate,
		googleCalendar: googleCalendarTemplate,
		emailAutomation: emailAutomationTemplate,
	};

	constructor(private readonly prisma: PrismaService) {}

	async createFromPreset(
		user: User,
		presetName: keyof typeof this.presets,
		name: string,
		description: string,
	) {
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
}
