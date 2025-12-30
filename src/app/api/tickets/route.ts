
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// Helper to parse cookies from request headers
function getCookieFromHeader(request: NextRequest, name: string): string | undefined {
    const cookie = request.headers.get('cookie');
    if (!cookie) return undefined;
    const match = cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : undefined;
}

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1] || getCookieFromHeader(request, 'token');
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'CUSTOMER') {
            return NextResponse.json({ error: 'Only customers can create tickets' }, { status: 403 });
        }

        const { title, description, priority } = await request.json();

        if (!title || !description) {
            return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
        }

        const ticket = await prisma.ticket.create({
            data: {
                title,
                description,
                priority: priority || 'MEDIUM',
                customerId: payload.userId as string,
            },
        });

        return NextResponse.json(ticket, { status: 201 });
    } catch (error) {
        console.error('Create ticket error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1] || getCookieFromHeader(request, 'token');
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const role = payload.role as string;
        const userId = payload.userId as string;

        let tickets;
        if (role === 'AGENT') {
            tickets = await prisma.ticket.findMany({
                include: { customer: { select: { name: true, email: true } }, agent: { select: { name: true } } },
                orderBy: { createdAt: 'desc' },
            });
        } else {
            tickets = await prisma.ticket.findMany({
                where: { customerId: userId },
                include: { agent: { select: { name: true } } },
                orderBy: { createdAt: 'desc' },
            });
        }

        return NextResponse.json(tickets);
    } catch (error) {
        console.error('Get tickets error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
