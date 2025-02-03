import { JwtPayload } from './JwtPayload';

export interface RequestPayload extends Request {
  user: JwtPayload;
}
