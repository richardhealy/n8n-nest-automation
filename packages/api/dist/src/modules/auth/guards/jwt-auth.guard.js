"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        console.log('JwtAuthGuard executing');
        const result = super.canActivate(context);
        if (result instanceof Promise) {
            return result.then(value => {
                const request = context.switchToHttp().getRequest();
                console.log('JwtAuthGuard request.user:', request.user);
                return value;
            });
        }
        if (result instanceof rxjs_1.Observable) {
            return result.pipe((0, operators_1.tap)(() => {
                const request = context.switchToHttp().getRequest();
                console.log('JwtAuthGuard request.user:', request.user);
            }));
        }
        const request = context.switchToHttp().getRequest();
        console.log('JwtAuthGuard request.user:', request.user);
        return result;
    }
    handleRequest(err, user) {
        console.log('JwtAuthGuard handleRequest user:', user);
        if (err || !user) {
            throw err;
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map