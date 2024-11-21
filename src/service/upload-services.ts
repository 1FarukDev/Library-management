import fs from 'fs/promises';
import cloudinary from '../config/cloudinary';

interface BookUploadResponse {
    url: string;
    publicId: string;
    bytes: number;
}

export class BookUploadService {
    static async uploadBook(filePath: string): Promise<BookUploadResponse> {
        try {
            const uploadResult = await cloudinary.uploader.upload(filePath, {
                folder: 'books',
                resource_type: 'raw',
                use_filename: true,
                unique_filename: true
            });

            await fs.unlink(filePath);

            return {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                bytes: uploadResult.bytes
            };
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new Error('Book upload failed');
        }
    }
}