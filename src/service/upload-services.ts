import fs from 'fs/promises';
import cloudinary from '../config/cloudinary';

interface BookUploadResponse {
    url: string;
    publicId: string;
    bytes: number;
}
interface AvatarUploadResponse {
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

export class AvatarUploadService {
    static async uploadAvatar(filePath: string): Promise<AvatarUploadResponse> {
        try {
            const uploadAvatarResult = await cloudinary.uploader.upload(filePath, {
                folder: 'avatar',
                resource_type: 'raw',
                use_filename: true,
                unique_filename: true
            })
            await fs.unlink(filePath)
            return {
                url: uploadAvatarResult.secure_url,
                publicId: uploadAvatarResult.public_id,
                bytes: uploadAvatarResult.bytes
            }
        } catch (error) {
            console.error('Cloudnary upload error', error)
            throw new Error('Avatar upload failed')

        }
    }

    static async deleteAvatar(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Cloudinary delete error', error);
            throw new Error('Failed to delete the avatar');
        }
    }
}