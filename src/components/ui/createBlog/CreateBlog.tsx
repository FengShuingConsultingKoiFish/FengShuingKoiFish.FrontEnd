import Container from "../Container"
import { BackgroundGradient } from "../Gradient"
import { PlaceholdersAndVanishInput } from "../PlaceHolderInput"
import { TextGenerateEffect } from "../TextGenerate"
import useBlogModal from "@/hooks/useBlogModel"
interface CreateBlogProps {
  onClick: () => void
}

const CreateBlog: React.FC<CreateBlogProps> = ({ onClick }) => {
  const blogModal = useBlogModal();
  
  const words = `Hãy cho chúng tôi biết bạn đang nghĩ gì`
  const placeholders = [
    "Bạn đang thắc mắc về mệnh của mình ?",
    "Lý do bạn muốn được tư vấn về cá Koi?",
    "Bạn có dự định gì ?",
    "Vì sao bạn biết đến chúng tôi ?"
  ]

  return (
    <Container>
      <div className="mb-20 flex justify-center items-center">
        <BackgroundGradient className="w-full rounded-[22px] bg-white p-0 sm:p-0">
          <div 
            className="flex h-[10rem] flex-col items-center justify-center px-4 cursor-pointer"
            onClick={blogModal.onOpen}
          >
            <TextGenerateEffect words={words} />
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={() => {}}
              onSubmit={() => {}}
            />
          </div>
        </BackgroundGradient>
      </div>
    </Container>
  )
}

export default CreateBlog
