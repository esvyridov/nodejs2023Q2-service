import { Injectable } from '@nestjs/common';
import { v4 as uuidv4, validate } from 'uuid';

@Injectable()
export class UUIDService {
    generate(): string {
        return uuidv4();
    }

    validate(value: string): boolean {
        return validate(value);
    }
}
