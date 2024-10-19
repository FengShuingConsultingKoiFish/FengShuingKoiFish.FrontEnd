import { Button } from "@/components/global/atoms/button"

function ArtFengShui() {
  return (
    <div className="flex justify-between">
      <div className="flex w-1/2 items-center justify-center">
        <img
          src="https://bizweb.dktcdn.net/100/307/111/files/ca-koi-phong-thuy2.jpg?v=1535046138308"
          alt="artFengShui"
          className="h-[500px] w-[500px] rounded-full"
        />
      </div>

      <div className="flex w-1/2 flex-col justify-center gap-6">
        <h1 className="text-3xl font-bold text-primary">
          Nghệ Thuật Phong Thủy Cá Koi – Sự Hài Hòa Giữa Thiên Nhiên Và Vận May
        </h1>
        <p className="text-justify">
          Phong thủy cá koi là một biểu tượng của sự thịnh vượng, may mắn và sức
          mạnh trong văn hóa Á Đông. Được nuôi trong những hồ nước thanh bình,
          cá koi không chỉ làm đẹp không gian sống mà còn mang lại năng lượng
          tích cực, giúp cân bằng các yếu tố tự nhiên. Với khả năng thích nghi
          cao, màu sắc rực rỡ và tuổi thọ lâu dài, cá koi được coi là hiện thân
          của sự kiên trì và thành công. Bố trí hồ cá koi theo phong thủy giúp
          thu hút tài lộc, bình an và mang đến sự hòa hợp cho ngôi nhà.
        </p>
        <Button variant={"outline"} className="w-32">
          Xem thêm
        </Button>
      </div>
    </div>
  )
}

export default ArtFengShui
