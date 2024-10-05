import { Button } from "@/components/global/atoms/button"

function Introduciton() {
  return (
    <div className="space-y-6 bg-gray-200 py-10 text-center">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-primary">
          Huớng dẫn chọn các koi phù hợp phong thủy
        </h1>
        <p>
          Các chuyên gia phong thủy của chúng tôi ở đây để giúp bạn tạo ra môi
          trường hài hòa hoàn hảo cho không gian sống của bạn.
        </p>
      </div>
      <Button>Dịch vụ</Button>
    </div>
  )
}

export default Introduciton
