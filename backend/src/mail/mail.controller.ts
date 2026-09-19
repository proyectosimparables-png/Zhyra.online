import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @Get('test')
  async sendTestMail(@Query('to') to: string) {
    if (!to) return { success: false, message: 'Falta parámetro "to"' };
    try {
      await this.mailService.sendMail(to, 'Test NestJS', '<p>Funcionando correctamente</p>');
      return { success: true, message: `Correo enviado a ${to}` };
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : String(err) };
    }
  }

  @Post('subscribe')
  async subscribe(@Body('email') email: string) {
    if (!email) return { success: false, message: "Email requerido" };

   await this.mailService.sendMail(
        'zhyra.online@gmail.com',
        'Nueva suscripción 💜',
        `
          <h2>Nuevo suscriptor</h2>
          <p><strong>Email:</strong> ${email}</p>
        `,
      );

      // 📩 2. Mail para el usuario (bienvenida)
      await this.mailService.sendMail(
        email,
        'Bienvenida a Zhyra 💜',
        `
          <h1>Gracias por suscribirte 💜</h1>
          <p>Te vamos a avisar cuando haya novedades ✨</p>
        `,
      );

    return { success: true, message: "Suscripción enviada" };
  }

  // Opcional: Endpoint para disparar cancelación manualmente si fuera necesario
  @Post('notify-cancel')
  async notifyCancel(@Body() data: { to: string, name: string, orderId: string, motivo: string }) {
    await this.mailService.sendOrderCancelledNotification(data.to, data.name, data.orderId, data.motivo);
    return { success: true };
  }
}