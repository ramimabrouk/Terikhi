import { Injectable } from '@nestjs/common';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

/**
 * Tiny JSON-file persistence: no database to install. Writes are serialised
 * per file and done atomically (write to .tmp, then rename).
 */
@Injectable()
export class JsonStoreService {
  private readonly dataDir = process.env.DATA_DIR ?? join(__dirname, '../../data');
  private readonly queues = new Map<string, Promise<unknown>>();

  async read<T>(name: string, fallback: T): Promise<T> {
    try {
      const raw = await readFile(this.file(name), 'utf8');
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  /** Read-modify-write under a per-file lock. */
  async update<T>(name: string, fallback: T, change: (current: T) => T): Promise<T> {
    const previous = this.queues.get(name) ?? Promise.resolve();
    const next = previous.then(async () => {
      const current = await this.read<T>(name, fallback);
      const updated = change(current);
      const file = this.file(name);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(`${file}.tmp`, JSON.stringify(updated, null, 2), 'utf8');
      await rename(`${file}.tmp`, file);
      return updated;
    });
    this.queues.set(name, next.catch(() => undefined));
    return next;
  }

  private file(name: string): string {
    return join(this.dataDir, `${name}.json`);
  }
}
