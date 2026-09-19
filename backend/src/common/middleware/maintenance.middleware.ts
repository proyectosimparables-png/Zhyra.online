import { 
  Injectable, 
  NestMiddleware, 
  ServiceUnavailableException, 
  BadRequestException 
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
    constructor(private prisma: PrismaService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        // 0. 🛡️ FILTRO DE SEGURIDAD (Sanitización rápida)
        // Bloquea intentos de Path Traversal, Command Injection, XSS y Null Bytes
        const invalidPattern = /(\.\.\/|\.\.\\|%25|%00|<script>|exec|system|%26|%7C)/i;
        
        if (invalidPattern.test(req.originalUrl)) {
            throw new BadRequestException('Petición bloqueada por reglas de seguridad');
        }

        // 1. Verificar si la tienda está en mantenimiento en la base de datos
        const config = await this.prisma.configuracionTienda.findFirst();
        if (!config || !config.mantenimientoActivo) return next();

        // 2. Rutas esenciales de la API que jamás se bloquean por mantenimiento
        const isEssentialPath =
            req.url.includes('/auth') ||
            req.url.includes('/configuracion-tienda');

        if (isEssentialPath) return next();

        // 3. ¿Es el ADMIN real navegando? (Validación por Cookie)
        const cookies = req.headers.cookie;
        if (cookies) {
            const tokenMatch = cookies.match(/(?:^|; )token=([^;]*)/);
            const token = tokenMatch ? tokenMatch[1] : null;

            if (token) {
                try {
                    const decoded: any = jwt.decode(token);
                    if (decoded && decoded.role === 'ADMIN') {
                        return next();
                    }
                } catch (e) {
                    // Token inválido, ignoramos
                }
            }
        }

        // 4. ¿Trae el "Pase VIP" en los headers? (Clientes con el código ingresado)
        const vipHeader = req.headers['x-maintenance-code'];
        if (vipHeader === config.mantenimientoCodigo) {
            return next();
        }

        // 5. Si no es ruta esencial, no es admin y no tiene código VIP => Bloqueamos 503
        throw new ServiceUnavailableException({
            statusCode: 503,
            message: config.mantenimientoMensaje,
            error: 'Maintenance Mode',
        });
    }
}