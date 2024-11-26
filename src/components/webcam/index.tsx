import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import React, { useCallback, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { useTranslation } from 'react-i18next';
import { CiCrop } from 'react-icons/ci';
import { FaExchangeAlt } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { MdCheck, MdOutlineCameraswitch } from 'react-icons/md';
import Webcam from 'react-webcam';

interface CustomWebcamProps {
  type: string;
  onCapture: (image: File) => void;
}

const FACING_MODE_USER = 'user';
const FACING_MODE_ENVIRONMENT = 'environment';

const CustomWebcam: React.FC<CustomWebcamProps> = ({
  type = 'landscape',
  onCapture
}) => {
  const { t } = useTranslation();
  const webcamRef = useRef<Webcam | null>(null);
  const [captureImage, setCaptureImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<string>(FACING_MODE_USER);
  const [mirrored, setMirrored] = useState<boolean>(false);
  const [isUsePhoto, setIsUsePhoto] = useState<boolean>(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const onCropComplete = useCallback(
    (
      _croppedArea: { x: number; y: number; width: number; height: number },
      croppedAreaPixels: { x: number; y: number; width: number; height: number }
    ) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const generateCroppedImage = useCallback(async () => {
    if (captureImage === null || croppedAreaPixels == null) return;

    const image = document.createElement('img');
    image.src = captureImage;

    await new Promise(resolve => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx == null) return;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const croppedDataURL = canvas.toDataURL('image/jpeg');
    setCroppedImage(croppedDataURL);
  }, [captureImage, croppedAreaPixels]);

  const dataURLToFile = (dataURL: string, fileName: string): File => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] ?? 'image/jpeg';
    const bstr = atob(arr[1]);
    let n: number = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n > 0) {
      u8arr[n - 1] = bstr.charCodeAt(n - 1);
      n--;
    }

    return new File([u8arr], fileName, { type: mime });
  };

  const handleSavePicture = (): void => {
    if (croppedImage !== null) {
      const file = dataURLToFile(croppedImage, 'cropped_image.jpg');
      onCapture(file);
    }
  };

  const handleUsePhoto = (): void => {
    if (captureImage !== null) {
      const file = dataURLToFile(captureImage, 'capture_image.jpg');
      onCapture(file);
    }
  };

  const videoConstraints: MediaTrackConstraintSet = {
    facingMode,
    width: type === 'landscape' ? 940 : 440,
    height: type === 'landscape' ? 440 : 650
  };

  const toggleFacingMode = useCallback(() => {
    setFacingMode(prevMode =>
      prevMode === FACING_MODE_USER ? FACING_MODE_ENVIRONMENT : FACING_MODE_USER
    );
  }, []);

  const toggleMirror = useCallback(() => {
    setMirrored(prevMirror => !prevMirror);
  }, []);

  const retake = (): void => {
    setCaptureImage(null);
    setCroppedImage(null);
    setIsUsePhoto(false);
  };

  const capture = useCallback(() => {
    if (webcamRef.current != null) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc !== null) {
        setCaptureImage(imageSrc);
      }
    }
  }, [webcamRef]);

  return (
    <div>
      {captureImage !== undefined && captureImage !== null ? (
        isUsePhoto ? (
          croppedImage !== null ? (
            <div className="relative">
              <Image
                src={croppedImage}
                alt="Capture"
                width={type === 'landscape' ? 940 : 440}
                height={type === 'landscape' ? 440 : 650}
                className="object-cover md:rounded-b-2xl rounded-none max-w-[940px] md:max-h-[440px] max-h-[650px]"
              />
              <div
                onClick={retake}
                className="absolute bottom-6 md:left-[35%] left-[20%] w-10 h-10 bg-transparent border-2 border-white flex items-center justify-center rounded-full cursor-pointer hover:scale-105 duration-200"
              >
                <IoMdClose size={26} color="white" />
              </div>
              <div
                onClick={handleSavePicture}
                className="absolute bottom-6 md:right-[35%] right-[20%] w-10 h-10 bg-[#1A857D] flex items-center justify-center rounded-full cursor-pointer hover:scale-105 duration-200"
              >
                <MdCheck size={26} color="white" />
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <Cropper
                image={captureImage}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                aspect={1 / 1}
                cropShape={'round'}
                classes={{
                  containerClassName: `mt-[60px] rounded-b-2xl ${
                    type === 'landscape'
                      ? 'w-[940px] h-[440px]'
                      : 'w-full h-full'
                  }`
                }}
              />
              <div
                onClick={() => {
                  setIsUsePhoto(false);
                }}
                className="absolute md:bottom-4 bottom-12 md:left-[25%] left-[20%] w-10 h-10 bg-transparent border-2 border-white flex items-center justify-center rounded-full cursor-pointer hover:scale-105 duration-200"
              >
                <IoMdClose size={26} color="white" />
              </div>
              <div
                onClick={generateCroppedImage}
                className="absolute md:bottom-4 bottom-12 md:right-[25%] right-[20%] w-10 h-10 bg-[#1A857D] text-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 duration-200"
              >
                <MdCheck size={26} color="white" />
              </div>
            </div>
          )
        ) : (
          <div className="relative">
            <Image
              src={captureImage}
              alt="Capture"
              width={type === 'landscape' ? 940 : 440}
              height={type === 'landscape' ? 440 : 650}
            />
            <div
              onClick={retake}
              className="absolute bottom-6 md:left-[25%] left-[15%] cursor-pointer hover:pb-1 duration-200"
            >
              <Typography className="font-poppins font-normal text-lg text-white">
                {t('chat.retake')}
              </Typography>
            </div>
            <div
              onClick={handleUsePhoto}
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer hover:pb-1 duration-200"
            >
              <Typography className="font-poppins font-normal text-lg text-white">
                {t('chat.usePhoto')}
              </Typography>
            </div>
            <div
              onClick={() => {
                setIsUsePhoto(true);
              }}
              className="absolute bottom-5 md:right-[28%] right-[20%] cursor-pointer hover:pb-1 duration-200 w-10 h-10 bg-transparent flex items-center justify-center rounded-full hover:scale-105"
            >
              <CiCrop size={26} color="white" />
            </div>
          </div>
        )
      ) : (
        <div className="relative">
          <Webcam
            className="md:rounded-b-2xl rounded-none"
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={1}
            videoConstraints={videoConstraints}
            mirrored={mirrored}
          />
          <div
            onClick={capture}
            className="absolute bottom-3 left-1/2 transform -translate-x-1/2 cursor-pointer hover:scale-105 duration-200"
          >
            <div className="md:w-16 w-14 md:h-16 h-14 rounded-full bg-transparent border-[3px] border-white flex items-center justify-center">
              <div className="md:w-12 w-10 md:h-12 h-10 bg-white rounded-full"></div>
            </div>
          </div>
          <div
            onClick={toggleMirror}
            className="absolute bottom-6 md:left-[35%] left-[20%] cursor-pointer hover:scale-105 duration-200"
          >
            <FaExchangeAlt size={30} color="white" />
          </div>
          <div
            onClick={toggleFacingMode}
            className="absolute bottom-6 md:right-[35%] right-[20%] cursor-pointer hover:scale-105 duration-200"
          >
            <MdOutlineCameraswitch size={30} color="white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomWebcam;
