import React from "react"

import { useLocation, useNavigate } from "react-router-dom"

import "../styles/fengshui.css"

const ResultPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { name, gender, birthDate } = location.state || {}

  const handleNewLookup = () => {
    navigate("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="mb-8 text-2xl font-bold">
          <br />
          GIẢI MÃ PHONG THỦY
        </h1>
        <div className="relative inline-block h-[420px] w-[660px] rounded-3xl border-2 border-purple-300 bg-white p-8 shadow-lg">
          <div className="mb-2 flex justify-center">
            <img
              src="https://png.pngtree.com/png-vector/20190723/ourlarge/pngtree-koi-fish-and-sakura-flower-logo-luck-prosperity-and-good-fortune-png-image_1570092.jpg"
              alt="Koi Fish Logo"
              className="h-32 w-32 rounded-full border-4 border-yellow-400"
            />
          </div>
          <div className="flex text-left">
            <div className="ml-[80px] flex-1">
              <p className="mb-2 font-bold">Họ tên</p>
              <p className="mb-2 font-bold">Giới tính</p>
              <p className="mb-2 font-bold">Ngày sinh</p>
              <p className="mb-2 font-bold">Mệnh</p>
              <p className="mb-2 font-bold">Màu Cá Koi</p>
            </div>

            <div className="flex-1">
              <p className="mb-2">{name}</p>
              <p className="mb-2">{gender}</p>
              <p className="mb-2">{birthDate}</p>
              <p className="mb-2"></p>
              <p className="mb-2"></p>
            </div>
          </div>
          <button
            className="button-glow mt-4 rounded-md bg-purple-500 px-4 py-2 text-white"
            onClick={handleNewLookup}
          >
            TRA CỨU MỚI
          </button>
        </div>

        <div className="bg-cream-stone container mb-8 mt-8 w-[1600px] rounded-lg p-8">
          <h1 className="title mb-8 mt-4 text-3xl font-bold">
            NHỮNG LOẠI CÁ NÊN SỬ DỤNG
          </h1>

          <div className="grid grid-cols-2 gap-4">
            <div className="card relative flex items-center bg-transparent">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWw-lRjaK7YMjZ7s5WQvf1RmNZDKC3tl55mQ&s"
                alt="Moonstone - Đá mặt trăng"
                className="h-[329px] w-[345px] rounded-l-md object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="card-content relative z-10 -ml-8 w-[370px] rounded-r-md bg-white/50 p-4 shadow-lg">
                <h2 className="card-title font-bold text-purple-700">
                  MOONSTONE
                </h2>
                <p className="card-text text-left text-sm text-gray-700">
                  Đá mặt trăng là loại đá cực kỳ hiếm ở Việt Nam. Mặt đá trong
                  đục, soi lên ánh sáng sẽ có ánh xà cừ thành một dải sáng màu
                  xanh ngọc đẹp lung linh. Do vẻ sáng mờ ảo lung linh của đá nên
                  người La Mã và Hindu cổ đại nghĩ là đá mặt trăng thực sự đã
                  được tạo ra từ ánh trăng. Truyền thuyết kể rằng bạn có thể
                  thấy được tương lai nếu bạn ngậm một viên đá mặt trăng trong
                  miệng lúc trăng tròn.
                </p>
              </div>
            </div>
            <div className="card relative flex items-center bg-transparent">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWw-lRjaK7YMjZ7s5WQvf1RmNZDKC3tl55mQ&s"
                alt="Thạch anh tóc vàng"
                className="h-[329px] w-[345px] rounded-l-md object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="card-content relative z-10 -ml-8 w-[370px] rounded-r-md bg-white/50 p-4 shadow-lg">
                <h2 className="card-title font-bold text-purple-700">
                  THẠCH ANH TÓC VÀNG
                </h2>
                <p className="card-text text-left text-sm text-gray-700">
                  Là viên đá có sức mạnh khó đoán. Tuy chỉ đứng thứ 7 trên thang
                  độ cứng MOHS, nhưng tùy thuộc vào độ trong, lượng tóc ánh kim
                  dày/mỏng, mà khả năng khúc tán năng lượng của từng viên đá sẽ
                  biến thiên. Khả năng chiết suất ánh sáng của Thạch anh tóc
                  vàng có thể còn mạnh hơn cả Kim Cương.
                </p>
              </div>
            </div>
            <div className="card relative flex items-center bg-transparent">
              <img
                src="https://sanvuonphutaidat.vn/upload/images/18.jpg"
                alt="Labradorite - Đá xà cừ"
                className="h-[329px] w-[345px] rounded-l-md object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="card-content relative z-10 -ml-8 w-[370px] rounded-r-md bg-white/50 p-4 shadow-lg">
                <h2 className="card-title font-bold text-purple-700">
                  LABRADORITE
                </h2>
                <p className="card-text text-left text-sm text-gray-700">
                  Labradorite hay còn gọi là đá Xà Cừ. Theo người Inuit,
                  Labradorite rơi xuống từ ngọn lửa băng giá của Bắc cực Quang.
                  Đó là một tín thể của các pháp sư, nhà tiên tri, người chữa
                  lành. Mang Labradorite bên mình giúp tăng cường trực giác của
                  khả năng thấu thị, thần giao cách cảm, tiên tri.
                </p>
              </div>
            </div>
            <div className="card relative flex items-center bg-transparent">
              <img
                src="https://sanvuonphutaidat.vn/upload/images/18.jpg"
                alt="Các loại đá khác"
                className="h-[329px] w-[345px] rounded-l-md object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="card-content relative z-10 -ml-8 w-[370px] rounded-r-md bg-white/50 p-4 shadow-lg">
                <h2 className="card-title font-bold text-purple-700">
                  CÁC LOẠI ĐÁ KHÁC
                </h2>
                <p className="card-text text-left text-sm text-gray-700">
                  Ngoài ra có thể sử dụng các loại đá có mức năng lượng tầm
                  trung khác như thạch anh trắng, thạch anh tóc vàng ... tùy vào
                  nhu cầu & điều kiện.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultPage
