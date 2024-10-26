import { useEffect, useState } from "react";
import { IconPencilPlus } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { getPurchasedPackageById } from "@/lib/api/PurchasedPkg";
import { RootState } from "@/lib/redux/store";
import { AuroraBackground } from "@/components/ui/AuroraBg";
import { ArticleReading } from "@/components/ui/blog/ArticleReading";
import CustomButton from "../Setting/Components/CustomBtn";
import { useNavigate } from "react-router-dom";
import { setUserPackageDetail } from "@/lib/redux/reducers/userPackageSlice";

interface ImageViewDTO {
  id: number;
  filePath: string;
  altText?: string | null;
  userId: string;
  userName: string;
  createdDate: string;
}

interface AdvertisementPackageViewDTO {
  id: number;
  name: string;
  price: number;
  description: string;
  limitAd: number;
  limitContent: number;
  limitImage: number;
  createdDate: string;
  imageViewDTOs: ImageViewDTO[];
}

export const UserPackageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [packageDetail, setPackageDetail] = useState<AdvertisementPackageViewDTO| null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = useSelector((state: RootState) => state.users.detailUser);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPackageDetail = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await getPurchasedPackageById(Number(id));
        console.log(response)
        const packageDetailData: AdvertisementPackageViewDTO = response.result.advertisementPackageViewDTO;
        dispatch(setUserPackageDetail(packageDetailData)); 
        setPackageDetail(packageDetailData);
        console.log("packageDetailData", packageDetailData)

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching package:", err);
        setError("Failed to load package details");
        setIsLoading(false);
      }
    };

    fetchPackageDetail();
  }, [id]);



  const data = [
    {
      title: "Giới thiệu",
      content: (
        <div>
          <p className="mb-8 text-5xl font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            {packageDetail?.description || "No description available"}
          </p>
        </div>
      ),
    },
    {
      title: "Hình ảnh từ gói",
      content: (
        <div>
          <p className="mb-8 text-xl font-normal text-neutral-800 dark:text-neutral-200">
            Hình ảnh từ gói dịch vụ
          </p>
          {packageDetail?.imageViewDTOs && packageDetail.imageViewDTOs.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {packageDetail.imageViewDTOs.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.filePath}
                    alt={`Image ${image.id}`}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>Không có hình ảnh nào để hiển thị.</p>
          )}
        </div>
      ),
    },
  ];

  const handleClickToCreateAdver = () => {
    navigate("/tao-goi-quang-cao")  
  }


  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col items-center justify-start gap-4 px-4 py-10"
      >
        <div className="w-full">
          {isLoading ? (
            <div className="flex h-screen items-center justify-center">
              <ClipLoader size={40} color="#000" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-10">
              <h2 className="mb-4 max-w-4xl text-lg text-black md:text-4xl">
                {packageDetail?.name || "Package Details"}
              </h2>
              <p className="inline-flex max-w-sm items-center justify-start gap-4 text-sm font-semibold text-black md:text-base">
                <span className="text-xl">Giá :</span>
                {packageDetail?.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
              <ArticleReading data={data} />
            </div>
          )}
          <div className="flex items-center justify-center">
            <CustomButton icon={<IconPencilPlus/>} label="Tạo quảng cáo của bạn ngay" onClick={handleClickToCreateAdver} />
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
};
