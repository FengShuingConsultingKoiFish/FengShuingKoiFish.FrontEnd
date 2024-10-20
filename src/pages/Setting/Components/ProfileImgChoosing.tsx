import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import useProfileImgModal from "@/hooks/useProfileImgModal";
import { getImagesForMember } from "@/lib/api/Image";
import BlogModal from "@/pages/Blog/components/BlogModal";
import toast from "react-hot-toast";

interface Image {
  id: number;
  imageUrl: string;
}

interface ProfileImgChoosingModalProps {
  onSelectImage: (selectedImage: Image) => void; 
}

const ProfileImgChoosingModal: React.FC<ProfileImgChoosingModalProps> = ({
  onSelectImage, 
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const profileImgModal = useProfileImgModal();

  useEffect(() => {
    console.log("ImgChoosingModal open status:", profileImgModal.isOpen);
    if (profileImgModal.isOpen) {
      const fetchImages = async () => {
        try {
          setIsLoading(true);
          console.log("Fetching images...");
          const requestData = {
            pageIndex: 10, 
            pageSize: 7,
            name: "",
            orderDate: null,
          };
          const response = await getImagesForMember(requestData);
          console.log("Images fetched:", response.result.datas);
          if (response.result && Array.isArray(response.result.datas)) {
            const mappedImages = response.result.datas.map((image) => ({
              id: image.id,
              imageUrl: image.filePath,
            }));
            setImages(mappedImages);
          } else {
            console.error("Error: No images found.");
          }
        } catch (error) {
          console.error("Error fetching images:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchImages();
    }
  }, [profileImgModal.isOpen]);

  // Handle image selection
  const handleImageSelection = (image: Image) => {
    setSelectedImage(image); 
  };

  const handleSave = () => {
    if (selectedImage) {
      onSelectImage(selectedImage);
      profileImgModal.onClose();
    } else {
      toast.error("Vui lòng chọn 1 ảnh.");
    }
  };

  if (!profileImgModal.isOpen) return null;

  const bodyContent = images.length > 0 ? (
    <div className="grid grid-cols-3 gap-4 cursor-pointer">
      {images.map((image) => (
        <div
          key={image.id}
          className={`border p-2 ${
            selectedImage?.id === image.id ? "border-blue-500" : "border-gray-300"
          }`}
          onClick={() => handleImageSelection(image)}
        >
          <img
            src={image.imageUrl}
            alt="selected"
            className="h-32 w-full object-cover"
          />
        </div>
      ))}
    </div>
  ) : (
    <p>Hiện tại chưa có ảnh nào trong thư viện của bạn </p>
  );

  return (
    <BlogModal
      disabled={isLoading}
      isOpen={profileImgModal.isOpen}
      title="Chọn ảnh"
      actionLabel={isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Lưu"}
      onClose={profileImgModal.onClose}
      onSubmit={handleSave}
      body={bodyContent}
      currentUser
    />
  );
};

export default ProfileImgChoosingModal;
