import { useEffect, useRef } from 'react';
import { socket } from '../context';

let ctx: CanvasRenderingContext2D, ctx2: CanvasRenderingContext2D;

const hiddenStyle = {
  display: 'none',
};

export const Exercise = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);

  let videoStream: MediaStream | null = null;

  useEffect(() => {
    socket.on('blob:return', (data) => onBlob(data, ctx2!));
    socket.on('blob:start-response', () => snapshot());

    if (!videoRef.current || !canvasRef.current || !canvasRef2.current) return;

    ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;
    ctx2 = canvasRef2.current.getContext('2d') as CanvasRenderingContext2D;

    // const n = navigator as NavigatorExt;
    // n.getUserMedia  = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current!.srcObject = stream;
        videoStream = stream;

        socket.emit('blob:start');
      });
  }, []);

  const snapshot = () => {
    if (videoStream) {
      try {
        ctx!.drawImage(videoRef.current as HTMLVideoElement, 0, 0);

        canvasRef.current!.toBlob((blob) => {
          sendIo(blob!);
        });
      } catch (error) {}
    }
  };

  const sendIo = (data: Blob) => {
    data.arrayBuffer().then((arr) => {
      console.log(arr);
      socket.emit('blob', arr);
    });
  };

  const onBlob = (data: ArrayBuffer, ctx: CanvasRenderingContext2D) => {
    console.log(new Blob([data]), 'onBlob');
    const blob = new Blob([data]);

    createImageBitmap(blob).then((img) => {
      ctx.drawImage(img, 0, 0);

      snapshot();
    });
  };

  return (
    <div>
      <video autoPlay ref={videoRef} style={hiddenStyle}></video>
      <canvas
        ref={canvasRef}
        id="canvas"
        style={hiddenStyle}
        width="640"
        height="480"></canvas>
      <canvas ref={canvasRef2} id="canvas2" width="640" height="480"></canvas>
    </div>
  );
};
