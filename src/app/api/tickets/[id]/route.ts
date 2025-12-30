
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

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1] || getCookieFromHeader(request, 'token');
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'AGENT') {
            return NextResponse.json({ error: 'Only agents can update tickets' }, { status: 403 });
        }

        const { status, assignToMe } = await request.json();
        const updateData: any = {};

        if (status) updateData.status = status;
        if (assignToMe) updateData.agentId = payload.userId;

        const ticket = await prisma.ticket.update({
            where: { id: params.id },
            data: updateData,
        });

        return NextResponse.json(ticket);
    } catch (error) {
        console.error('Update ticket error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
