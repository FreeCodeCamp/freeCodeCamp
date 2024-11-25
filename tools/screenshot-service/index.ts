import {
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
  type PutObjectCommandOutput
} from '@aws-sdk/client-s3';
import express, { type Request, type Response } from 'express';

interface ImageUploadRequest {
  image: string;
  examAttemptId: string;
}

const app = express();

// Parse JSON bodies (in case images are sent as Base64 strings)
app.use(express.json({ limit: '5mb' }));

// Configure S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
  }
});

const uploadToS3 = (
  image: string,
  examAttemptId: string
): Promise<PutObjectCommandOutput> => {
  const params: PutObjectCommandInput = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: `${examAttemptId}/${Date.now()}`,
    Body: Buffer.from(image, 'base64'),
    ContentType: 'image/jpeg'
  };

  return s3.send(new PutObjectCommand(params));
};

// Route to handle image uploads from another backend
app.post(
  '/upload',
  async (req: Request<object, object, ImageUploadRequest>, res: Response) => {
    try {
      await uploadToS3(req.body.image, req.body.examAttemptId);
      res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (err) {
      console.error('Error uploading image:', err);
      res.status(500).json({ error: (err as Error).message });
    }
  }
);

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
