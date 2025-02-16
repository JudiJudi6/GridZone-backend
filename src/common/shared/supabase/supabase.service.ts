import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
    );
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error } = await this.supabase.storage
      .from('avatars')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = this.supabase.storage.from('avatars').getPublicUrl(filePath);

    return publicUrl;
  }

  async deleteAvatar(fileName: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from('avatars')
      .remove([fileName]);

    if (error) {
      throw new Error(`Failed to delete avatar: ${error.message}`);
    }
  }
}
