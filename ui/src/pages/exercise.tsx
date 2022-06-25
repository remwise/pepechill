import React from 'react';
import {io, Socket} from 'socket.io-client'

interface IExerciseState {
    videoRef: null | HTMLVideoElement;
}

interface NavigatorExt extends Navigator{
    getUserMedia(
        options: { video?: boolean; audio?: boolean; },
        success: (stream: any) => void,
        error?: (error: string) => void
    ) : void;
    webkitGetUserMedia(
        options: { video?: boolean; audio?: boolean; },
        success: (stream: any) => void,
        error?: (error: string) => void
    ) : void;
    mozGetUserMedia(
        options: { video?: boolean; audio?: boolean; },
        success: (stream: any) => void,
        error?: (error: string) => void
    ) : void;
    msGetUserMedia(
        options: { video?: boolean; audio?: boolean; },
        success: (stream: any) => void,
        error?: (error: string) => void
    ) : void;
}


export class Exercise extends React.Component<any, IExerciseState> {
    public videoRef: React.RefObject<HTMLVideoElement>
    public canvasRef: React.RefObject<HTMLCanvasElement>
    public canvasRef2: React.RefObject<HTMLCanvasElement>

    public hiddenStyle = {
        display: 'none'
    }

    public ctx?:CanvasRenderingContext2D;
    public ctx2?:CanvasRenderingContext2D;

    public socket: Socket

    public videoStream: MediaStream | null = null;

    constructor(props: any) {
        super(props);
        this.videoRef = React.createRef();
        this.canvasRef = React.createRef();
        this.canvasRef2 = React.createRef();

        this.socket = io('ws://localhost:3001');

        this.socket.on('blob:return', (data)=>this.onBlob(data, this.ctx2!))
        this.socket.on('blob:start-response', ()=>this.snapshot())
    }

    componentDidMount() {
        if(!this.videoRef.current || !this.canvasRef.current || !this.canvasRef2.current) return;

        this.ctx = this.canvasRef.current.getContext('2d') as CanvasRenderingContext2D;
        this.ctx2 = this.canvasRef2.current.getContext('2d') as CanvasRenderingContext2D;

        // const n = navigator as NavigatorExt;
        // n.getUserMedia  = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia;


        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream)=> {

            this.videoRef.current!.srcObject = stream;
            this.videoStream = stream;

            this.socket.emit('blob:start')
        })
    }

    snapshot () {
        if(this.videoStream) {
            try {
                this.ctx!.drawImage(this.videoRef.current as HTMLVideoElement, 0, 0)

                this.canvasRef.current!.toBlob((blob)=>{
                    this.sendIo(blob!);
                })
            } catch (error) {}
        }
    };

    sendIo(data: Blob) {

        data.arrayBuffer().then((arr)=> {
            console.log(arr)
            this.socket.emit("blob", arr);
        })

    }

    onBlob (data: ArrayBuffer, ctx: CanvasRenderingContext2D) {
        console.log(new Blob([data]), 'onBlob');
        const blob = new Blob([data])

        createImageBitmap(blob).then(img => {

            ctx.drawImage(img, 0,0)

            this.snapshot()
        })
    }


    render() {
        return (
            <div>
                <video autoPlay ref={ this.videoRef } style={ this.hiddenStyle }></video>
                <canvas ref={ this.canvasRef } id="canvas" style={ this.hiddenStyle } width="640" height="480" ></canvas>
                <canvas ref={ this.canvasRef2 } id="canvas2" width="640" height="480"></canvas>
            </div>
        )
    }
}
