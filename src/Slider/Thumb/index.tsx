import "./index.css"

interface Props {
    pos: number;
    onCapture: React.MouseEventHandler;
}

const Thumb: React.FC<Props> = ({pos, onCapture}) => {
    return <div onMouseDown={onCapture} className="Thumb" style={{left: `${pos * 100}%`}}/>
}


export default Thumb;