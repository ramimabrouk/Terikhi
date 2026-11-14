import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JsonStoreService } from '../storage/json-store.service';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  ip: string;
  createdAt: string;
}

const FILE = 'contact';
const MAX_MESSAGES = 5;
const WINDOW_MS = 10 * 60 * 1000;

@Injectable()
export class ContactService {
  private readonly attempts = new Map<string, number[]>();

  constructor(private readonly store: JsonStoreService) {}

  async create(input: unknown, ip: string): Promise<{ ok: true }> {
    this.checkRate(ip);
    const message = this.validate(input, ip);
    await this.store.update<ContactMessage[]>(FILE, [], (messages) => [...messages, message]);
    return { ok: true };
  }

  private checkRate(ip: string): void {
    const now = Date.now();
    const recent = (this.attempts.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
    if (recent.length >= MAX_MESSAGES) {
      throw new HttpException('Too many messages', HttpStatus.TOO_MANY_REQUESTS);
    }
    recent.push(now);
    this.attempts.set(ip, recent);
  }

  private validate(input: unknown, ip: string): ContactMessage {
    if (typeof input !== 'object' || input === null) {
      throw new BadRequestException('Body must be a JSON object');
    }
    const body = input as Record<string, unknown>;
    const name = this.clean(body['name']);
    const email = this.clean(body['email']);
    const message = this.clean(body['message']);
    if (name.length < 2 || name.length > 80) {
      throw new BadRequestException('name must contain 2 to 80 characters');
    }
    if (email.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('email is invalid');
    }
    if (message.length < 10 || message.length > 2000) {
      throw new BadRequestException('message must contain 10 to 2000 characters');
    }
    return { name, email, message, ip, createdAt: new Date().toISOString() };
  }

  private clean(value: unknown): string {
    return typeof value === 'string' ? value.trim().replace(/[<>]/g, '') : '';
  }
}
