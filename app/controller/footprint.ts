'use strict';
import BaseController from './base';

import { footprintValidationRule } from '../validate/footprint';

export default class FootprintController extends BaseController {
    constructor(ctx) {
        super(ctx);
        this.service = ctx.service.footprint;
        this.validateRule = footprintValidationRule;
    }
}
