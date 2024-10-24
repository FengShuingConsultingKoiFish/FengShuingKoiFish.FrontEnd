import { useEffect, useState, useCallback } from "react";
import CustomButton from "@/pages/Setting/Components/CustomBtn";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import { ClipLoader } from "react-spinners";
import useImgChoosingModal from "@/hooks/useChooseImgModal";
import { getImagesForMember } from "@/lib/api/Image";
import BlogModal from "./BlogModal";

interface Image {
  id: number;
  imageUrl: string;
}

interface ImgChoosingModalProps {
  onSelectImages: (selectedImages: Image[]) => void;
}

const ImgChoosingModal: React.FC<ImgChoosingModalProps> = ({ onSelectImages }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImages, setSelectedImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const imgChoosingModal = useImgChoosingModal();

  const fetchImages = useCallback(async () => {
    if (imgChoosingModal.isOpen) {
      setIsLoading(true);
      try {
        const requestData = {
          pageIndex,
          pageSize: 6,
          name: "",
          orderDate: null,
        };
        const response = await getImagesForMember(requestData);

        if (response.result && Array.isArray(response.result.datas)) {
          const mappedImages = response.result.datas.map((image) => ({
            id: image.id,
            imageUrl: image.filePath,
          }));
          setImages(mappedImages);
          setTotalPages(response.result.totalPages);
        } else {
          console.error("Error: No images found.");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [imgChoosingModal.isOpen, pageIndex]);

  useEffect(() => {
    console.log("ImgChoosingModal open status:", imgChoosingModal.isOpen);
    fetchImages();
  }, [fetchImages]);

  const toggleImageSelection = (image: Image) => {
    if (selectedImages.some((img) => img.id === image.id)) {
      setSelectedImages(selectedImages.filter((img) => img.id !== image.id));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleSave = () => {
    onSelectImages(selectedImages);
    imgChoosingModal.onClose();
  };

  const handleNextPage = () => {
    if (pageIndex < totalPages) {
      setPageIndex((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 1) {
      setPageIndex((prev) => prev - 1);
    }
  };

  if (!imgChoosingModal.isOpen) return null;

  const bodyContent =
    images.length > 0 ? (
      <div className="grid cursor-pointer grid-cols-3 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className={`border p-2 ${
              selectedImages.some((img) => img.id === image.id)
                ? "border-blue-500"
                : "border-gray-300"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleImageSelection(image);
            }}
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
      <p>No images found or error fetching images.</p>
    );

  const paginationControls = (
    <div className="mt-4 flex justify-between">
      <CustomButton
        icon={<IoIosArrowDropleftCircle />}
        label="Trang trước"
        onClick={handlePreviousPage}
        disabled={pageIndex === 1 || isLoading}
      />
      <span className="inline-flex items-center px-4">{`Trang ${pageIndex} trên ${totalPages}`}</span>
      <CustomButton
        icon={<IoIosArrowDroprightCircle />}
        label="Trang sau"
        onClick={handleNextPage}
        disabled={pageIndex === totalPages || isLoading}
      />
    </div>
  );

  return (
    <BlogModal
      disabled={isLoading}
      isOpen={imgChoosingModal.isOpen}
      title="Chọn ảnh"
      actionLabel={isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Lưu"}
      onClose={imgChoosingModal.onClose}
      onSubmit={handleSave}
      body={
        <>
          {bodyContent}
          {paginationControls}
        </>
      }
      currentUser
    />
  );
};

export default ImgChoosingModal;
