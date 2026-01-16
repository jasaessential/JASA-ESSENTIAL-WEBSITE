
export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getDriveClient } from "@/lib/googleDrive";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    try {
        const drive = getDriveClient();
        
        const fileMetadata: any = { name: file.name };

        const media = {
            mimeType: file.type,
            body: file.stream() as any, // Pass the stream directly
        };

        const uploadResponse = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: "id, webViewLink",
        });

        const fileId = uploadResponse.data.id;
        if (!fileId) {
            throw new Error("File ID not found after upload.");
        }

        // Make file public (anyone with the link can view)
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        // Use the direct download URL format
        const publicUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

        return NextResponse.json({
            success: true,
            fileId: fileId,
            url: publicUrl,
        }, { status: 200 });

    } catch (e: any) {
        console.error('Error in POST /api/upload:', e);
        return NextResponse.json({ error: "Upload failed", details: e.message }, { status: 500 });
    }
}
