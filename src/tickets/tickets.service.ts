import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { Ticket } from './ticket.interface.js';
import { CreateTicketDto } from './dto/create-ticket.dto.interface.js';
import { UpdateTicketsDto } from './dto/update-tickets.dto.interface.js';
@Injectable()
export class TicketsService {
    private readonly tickets: Ticket[] = [
        {
            id: 1,
            title: 'Sample Ticket 1',
            description: 'This is a sample ticket.',
            priority: 'high',
            status: 'open',
            createdAt: new Date().toISOString(),
        },
        {
            id: 2,
            title: 'Sample Ticket 2',
            description: 'This is another sample ticket.',
            priority: 'medium',
            status: 'in_progress',
            createdAt: new Date().toISOString(),
        },
        {
            id: 3,
            title: 'Sample Ticket 3',
            description: 'This is yet another sample ticket.',
            priority: 'low',
            status: 'closed',
            createdAt: new Date().toISOString(),
        },
    ];

    findAll(status?: Ticket['status'], priority?: Ticket['priority']) {
        let tickets = this.tickets;
        if (status) {
            tickets = tickets.filter(ticket => ticket.status === status);
        }
        if (priority) {
            tickets = tickets.filter(ticket => ticket.priority === priority);
        }
        return tickets;
    }
    findOne(id: number) {
        return this.tickets.find(ticket => ticket.id === id);
    }

    create(createTicketDto: CreateTicketDto) {
        const newTicket: Ticket = {
            id: this.tickets.length + 1,
            title: createTicketDto.title,
            description: createTicketDto.description,
            priority: createTicketDto.priority,
            status: 'open',
            createdAt: new Date().toISOString(),
        };
        this.tickets.push(newTicket);
        return newTicket;
    }

    update(id: number, updateTicketDto: UpdateTicketsDto) {
        const ticket = this.findOne(id);
        if (!ticket) {
            throw new NotFoundException('Ticket not found');
        }

        if(ticket.status === 'closed') {
            throw new BadRequestException('Cannot update a closed ticket');
        }

        Object.assign(ticket, updateTicketDto);
        return ticket;
    }
    closeTicket(id: number) {
        const ticket = this.findOne(id);
        if (!ticket) {
            throw new NotFoundException('Ticket not found');
        }
        if(ticket.status === 'closed') {
            throw new BadRequestException('Ticket is already closed');
        }
        ticket.status = 'closed';
        return ticket;
    }
}
