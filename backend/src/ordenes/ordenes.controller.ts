

import { Controller, Get, Patch, Post, Param, Body, ParseUUIDPipe, BadRequestException, Req, UseGuards } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { UpdateOrdenStatusDto } from './dto/update-ordene.dto';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { UnifiedAuthGuard } from 'src/auth/guards/supabase-auth.guard';


@Controller('ordenes')
@UseGuards(UnifiedAuthGuard)
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) { }

  @Get()
  findAll() {
    return this.ordenesService.findAll();
  }

  // ✅ Este es el endpoint que el "vigilante" del frontend consultará
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordenesService.findOne(id);
  }

  @Post()
  async create(@Body() createOrdeneDto: CreateOrdeneDto) {
    return this.ordenesService.crearOrden(createOrdeneDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateOrdenStatusDto,
  ) {
    return this.ordenesService.cambiarEstado(id, updateStatusDto.nuevoEstado);
  }


@Patch(':id/cancelar-cliente')
   //@UseGuards(supabase) // Asegurate de proteger esta ruta con tu AuthGuard
  async cancelarMiOrden(
    @Param('id') ordenId: string,
    @Body('motivo') motivo: string,
    @Req() req: any, // Supeditado a tu request donde el AuthGuard inyecta el req.user
  ) {
    const userId = req.user.id; // Ajusta según la estructura de tu payload JWT
    if (!userId) {
      throw new BadRequestException('Usuario no identificado');
    }

    return this.ordenesService.cancelarOrdenPorCliente(ordenId, userId, motivo, req.user.email);
  }


  @Post(':id/refund')
  refund(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordenesService.procesarReembolso(id);
  }

  @Patch(':id/notas-admin')
  updateAdminNotes(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('notasAdmin') notasAdmin: string, // Recibimos solo el campo específico
  ) {
    return this.ordenesService.actualizarNotasAdmin(id, notasAdmin);
  }

  @Patch(':id/cancelar')
  cancelar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: { motivo: string; restaurarStock: boolean; enviarEmail: boolean },
    
  ) {

    return this.ordenesService.cancelarOrden(id, dto);
  }

}