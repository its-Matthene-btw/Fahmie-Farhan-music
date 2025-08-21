import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE a contact submission by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await prisma.contactSubmission.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Contact submission deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact submission:', error);
        return NextResponse.json({ error: 'Failed to delete contact submission' }, { status: 500 });
    }
}
