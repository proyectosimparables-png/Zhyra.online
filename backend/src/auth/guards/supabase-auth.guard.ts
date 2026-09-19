import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as cookie from 'cookie';
import { supabase } from 'src/lib/supabaseClient';
import { LocalAuthService } from '../local/local.service';

@Injectable()
export class UnifiedAuthGuard implements CanActivate {
  constructor(private localService: LocalAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const cookies = cookie.parse(req.headers.cookie || '');

    // 1. Extraer token de cookies O de Header Authorization
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    const supabaseToken = cookies['access_token'] || bearerToken;
    const localToken = cookies['auth_token'] || bearerToken;

    // 2. Intentar Supabase
    if (supabaseToken) {
      const { data, error } = await supabase.auth.getUser(supabaseToken);

      if (!error && data?.user) {
        req['user'] = {
          id: data.user.id,
          email: data.user.email,
          provider: 'supabase',
        };
        return true;
      }
    }

    // 3. Intentar autenticación local
    if (localToken) {
      try {
        const user = await this.localService.getUserFromToken(localToken);
        req['user'] = {
          id: user.id,
          email: user.email,
          provider: 'local',
        };
        return true;
      } catch (e) {
        // No lanzamos excepción aquí todavía por si hay fallback o falla la firma
      }
    }

    // 4. Si ningún token fue válido
    throw new UnauthorizedException('No autenticado');
  }
}