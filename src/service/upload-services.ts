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
    static async uploadBook(fileBuffer: Buffer, fileName: string): Promise<BookUploadResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'books',
                    resource_type: 'raw',
                    use_filename: true,
                    unique_filename: true
                },
                (error, result) => {
                    if (error) {
                        return reject(new Error(error.message));
                    }
                    if (result) {
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                            bytes: result.bytes
                        });
                    }
                }
            );

            uploadStream.end(fileBuffer);
        });
    }
}



export class AvatarUploadService {
    static async uploadAvatar(fileBuffer: Buffer, fileName: string): Promise<AvatarUploadResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'avatar',
                    resource_type: 'image',
                    use_filename: true,
                    unique_filename: true,
                },
                (error, result) => {
                    if (error) {
                        return reject(new Error(error.message));
                    }
                    if (result) {
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                            bytes: result.bytes,
                        });
                    }
                }
            );
            uploadStream.end(fileBuffer);
        });
    }

    static async deleteAvatar(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            throw new Error('Failed to delete the avatar');
        }
    }
}
