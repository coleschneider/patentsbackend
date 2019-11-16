import { NextFunction, Request, Response } from 'express';
const HANDSHAKE_QUERY = 'handshake-interval';
const RETRY_QUERY = 'retry';
const LAST_EVENT_ID_QUERY = 'lastEventId';
const LAST_EVENT_ID_HEADER = 'last-event-id';

export interface ResponseExt extends Response {
  eventConnection: any;
}

const defaultConfig = {
  handShakeInterval: 3000,
  // https://www.w3.org/TR/eventsource/#concept-event-stream-reconnection-time
  retry: 3000,
};
function keepAlive(res: Response) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
}

function buildEventStream(fields: any): any {
  if (Array.isArray(fields)) {
    return fields.map(fieldSet => buildEventStream(fieldSet)).join('');
  }

  const { event, id, retry } = fields;
  let data = fields.data;
  let message = `retry: ${retry}\n`;

  if (id) {
    message += `id: ${id}\n`;
  }

  if (event) {
    message += `event: ${event}\n`;
  }

  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }

  message += `data: ${data}\n\n`;

  return message;
}

function configureStreamObject(message: any, { retry }: typeof defaultConfig) {
  message.retry = retry;

  return message;
}
function sse(res: ResponseExt, config: typeof defaultConfig) {
  return (message: any) => {
    message = configureStreamObject(message, config);
    const eventStream = buildEventStream(message);
    res.write(eventStream);
  };
}
function setHandshakeInterval(res: Response, updateInterval: number) {
  const handshakeInterval = setInterval(() => res.write(': sse-handshake\n'), updateInterval);
  res.on('finish', () => clearInterval(handshakeInterval));
  res.on('close', () => clearInterval(handshakeInterval));
}
const establishConnection = (res: Response, config: typeof defaultConfig) => {
  keepAlive(res);
  setHandshakeInterval(res, config.handShakeInterval);
};
const eventMiddleware = (options = defaultConfig) => (req: Request, res: ResponseExt, next: NextFunction) => {
  const config = {
    handShakeInterval: req.query[HANDSHAKE_QUERY] || options.handShakeInterval || defaultConfig.handShakeInterval,
    retry: req.query[RETRY_QUERY] || options.retry || defaultConfig.retry,
  };
  const eventConnection = sse(res, config);
  res.eventConnection = eventConnection;
  establishConnection(res, config);

  next();
};

export default eventMiddleware;
