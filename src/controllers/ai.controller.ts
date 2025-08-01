import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AIService } from '../service/ai/ai.service';
import { IsNotEmpty } from 'class-validator';
import { AuthGuard } from '../service/auth/auth.guard';

class AiRequestDto {
  @IsNotEmpty()
  prompt: string;
}

@Controller('ai')
@UseGuards(AuthGuard)
export class AIController {
  constructor(private readonly ai: AIService) {}
  @Post('products')
  async fetchProducts(@Body() req: AiRequestDto) {
    try {
      const data = await this.ai.productPrompt(req.prompt);
      return {
        success: true,
        message: 'Products fetched successfully',
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }
}
