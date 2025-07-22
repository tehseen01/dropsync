import { Card, CardContent } from "@/components/ui/card";
import FileUpload from "@/components/file-upload";

const UploadPage = async ({
  params,
}: {
  params: Promise<{ receiverId: string }>;
}) => {
  const { receiverId } = await params;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <Card>
        <CardContent>
          <FileUpload receiverId={receiverId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
