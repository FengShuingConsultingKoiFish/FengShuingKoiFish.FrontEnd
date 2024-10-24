import { ReactNode, useCallback, useEffect, useRef, useState } from "react"

import { IoMdClose } from "react-icons/io"

import useConfirmModal from "@/hooks/useConfirmModal"

import ModalButton from "@/components/ui/modals/ModalBtn"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  title?: string
  body?: React.ReactElement
  footer?: React.ReactElement
  actionLabel: string | ReactNode
  disabled?: boolean
  secondaryAction?: () => void
  secondaryActionLabel?: string
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel
}) => {
  const [showModal, setShowModal] = useState(isOpen)
  const modalRef = useRef<HTMLDivElement>(null)
  const confirmModal = useConfirmModal()

  const handleClose = useCallback(() => {
    if (disabled) {
      return
    }

    setShowModal(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }, [disabled, onClose])

  useEffect(() => {
    setShowModal(isOpen)
  }, [isOpen])

  // Handle closing modal on outside click
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose()
      }
    },
    [modalRef, handleClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, handleClickOutside])

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return
    }

    onSubmit()
  }, [disabled, onSubmit])

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return
    }
    secondaryAction?.()
  }, [disabled, secondaryAction])

  if (!isOpen) {
    return null
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-neutral-800/70 outline-none focus:outline-none">
        <div className="relative mx-auto my-6 h-full w-full md:h-auto md:w-4/5 lg:h-auto lg:w-3/6 xl:w-2/5">
          <div
            className={`translate h-full duration-300 ${showModal ? "translate-y-0" : "translate-y-full"} ${showModal ? "opacity-100" : "opacity-0"}`}
          >
            <div className="translate relative flex h-full w-full flex-col rounded-lg border-0 bg-white p-6 shadow-lg outline-none focus:outline-none md:h-auto lg:h-auto">
              {/* MODAL HEADER */}
              <div className="sticky top-0 z-10 flex items-center justify-between rounded-t border-b-[1px] bg-white p-4">
                <div className="items-center text-lg font-semibold">
                  {title}
                </div>
                <button
                  onClick={handleClose}
                  className="border-0 p-1 transition hover:opacity-70"
                >
                  <IoMdClose size={18} />
                </button>
              </div>
              {/* MODAL BODY */}
              <div className="relative max-h-[75vh] flex-auto overflow-y-auto">{body}</div>
              {/* MODAL FOOTER */}
              <div className="mt-6 flex flex-col gap-2">
                <div className="flex w-full flex-row items-center gap-4">
                  {secondaryAction && secondaryActionLabel && (
                    <ModalButton
                      disable={disabled}
                      label={secondaryActionLabel}
                      onClick={handleSecondaryAction}
                    />
                  )}

                  <ModalButton
                    disable={disabled}
                    label={actionLabel}
                    onClick={handleSubmit}
                  />
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmModal
