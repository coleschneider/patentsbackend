import 'express';

declare module 'express' {
  class EventConnectionType {
    constructor(req: Request);
    send<T>(data: T): void;
    setup(): void;
  }

  export interface Request {
    eventConnection: EventConnectionType;
  }
}
