import './arrow.css'

export default function (props) {

    return (
        <p style={{...props.style, borderColor: props.color}} className={`arrow ${props.direction}`}></p>
    )
}