import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/modal/Modal';
import CustomWebcam from '../webcam';

interface Props {
  onClose: () => void;
  onCapture: (captureImage: File) => void;
}

const ModalCamera: React.FC<Props> = ({ onClose, onCapture }) => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (screen.orientation.type === 'portrait-primary') {
      setIsMobile(true);
    }
  }, []);

  const handleWebcamCapture = (image: File): void => {
    onCapture(image);
    onClose();
  };

  return (
    <Modal
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-center items-center"
      modalClasses="z-50 fixed bottom-0 md:top-[10%] top-[5%] md:left-[18%] w-full md:w-[940px] h-full md:h-[500px] lg:rounded-2xl rounded-t-2xl shadow-lg bg-white"
    >
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <Image
          className="cursor-pointer hover:scale-110 duration-150"
          src={XIcon}
          alt="close"
          onClick={onClose}
          width={24}
          height={24}
        />
        <Typography className="font-poppins font-semibold text-lg">
          {t('chat.modalCameraTitle')}
        </Typography>
      </div>
      <CustomWebcam
        type={isMobile ? 'portrait' : 'landscape'}
        onCapture={handleWebcamCapture}
      />
    </Modal>
  );
};

export default ModalCamera;
