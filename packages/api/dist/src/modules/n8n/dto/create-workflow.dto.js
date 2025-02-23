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
exports.CreateWorkflowDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class WorkflowNode {
    constructor() {
        this.id = '';
        this.name = '';
        this.type = '';
        this.parameters = {};
        this.position = { x: 0, y: 0 };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WorkflowNode.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WorkflowNode.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WorkflowNode.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], WorkflowNode.prototype, "parameters", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], WorkflowNode.prototype, "position", void 0);
class WorkflowConnections {
    constructor() {
        this.node = '';
        this.type = '';
        this.items = [];
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WorkflowConnections.prototype, "node", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WorkflowConnections.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], WorkflowConnections.prototype, "items", void 0);
class WorkflowSettings {
    constructor() {
        this.saveExecutionProgress = true;
        this.saveManualExecutions = true;
        this.saveDataErrorExecution = 'all';
        this.saveDataSuccessExecution = 'all';
        this.executionTimeout = 3600;
        this.timezone = 'UTC';
    }
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WorkflowSettings.prototype, "saveExecutionProgress", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], WorkflowSettings.prototype, "saveManualExecutions", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WorkflowSettings.prototype, "saveDataErrorExecution", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WorkflowSettings.prototype, "saveDataSuccessExecution", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WorkflowSettings.prototype, "executionTimeout", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WorkflowSettings.prototype, "timezone", void 0);
class CreateWorkflowDto {
    constructor() {
        this.name = '';
        this.description = '';
        this.nodes = [];
        this.connections = {};
        this.settings = {
            saveExecutionProgress: true,
            saveManualExecutions: true,
            saveDataErrorExecution: 'all',
            saveDataSuccessExecution: 'all',
            executionTimeout: 3600,
            timezone: 'UTC'
        };
        this.active = false;
    }
}
exports.CreateWorkflowDto = CreateWorkflowDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WorkflowNode),
    __metadata("design:type", Array)
], CreateWorkflowDto.prototype, "nodes", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateWorkflowDto.prototype, "connections", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => WorkflowSettings),
    __metadata("design:type", WorkflowSettings)
], CreateWorkflowDto.prototype, "settings", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWorkflowDto.prototype, "active", void 0);
//# sourceMappingURL=create-workflow.dto.js.map