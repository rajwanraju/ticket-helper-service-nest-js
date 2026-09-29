import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { Ticket } from './ticket.interface.js';
import { CreateTicketDto } from './dto/create-ticket.dto.interface.js';
import { FilterTicketsQueryDto } from './dto/filter-tickets-query.dto.interface.js';
import { UpdateTicketsDto } from './dto/update-tickets.dto.interface.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {

    }

    @Get()
    findAll(@Query() filters: FilterTicketsQueryDto) {
        return this.ticketsService.findAll(filters.status, filters.priority);
    }

    @Get(':id')
    show(@Param('id',ParseIntPipe) id: number) {
        const ticket = this.ticketsService.findOne(id);
        if (!ticket) {
            throw new NotFoundException('Ticket not found');
        }
        return ticket;
    }

    @Post()
    create(@Body() createTicketDto: CreateTicketDto) {
        return this.ticketsService.create(createTicketDto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTicketDto: UpdateTicketsDto
    ) {
        return this.ticketsService.update(id, updateTicketDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/close')
    closeTicket(@Param('id', ParseIntPipe) id: number) {
        return this.ticketsService.closeTicket(id);
    }
}
