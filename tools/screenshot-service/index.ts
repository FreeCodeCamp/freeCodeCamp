import express, { type Request, type Response } from 'express';
import AWS from 'aws-sdk';
import { v7 as uuidv7 } from 'uuid';

const app = express();

// Parse JSON bodies (in case images are sent as Base64 strings)
app.use(express.json({ limit: '3mb' }));

// Configure S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const uploadToS3 = async (
  buffer: Buffer,
  mimetype: string
): Promise<AWS.S3.ManagedUpload.SendData> => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: `${uuidv7()}`,
    Body: buffer,
    ContentType: mimetype
  };

  return s3.upload(params).promise();
};

// Route to handle image uploads from another backend
app.post(
  '/upload',
  express.raw({ type: 'image/*', limit: '10mb' }),
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response) => {
    try {
      const buffer = assertContentIsBuffer(req.body);
      const data = await uploadToS3(buffer, req.get('Content-Type') as string);
      res.status(200).json({ data });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
);

function assertContentIsBuffer(content: unknown): Buffer {
  if (!Buffer.isBuffer(content)) {
    throw new Error('Content must be a Buffer');
  }
  return content;
}

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
