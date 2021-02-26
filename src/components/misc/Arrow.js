import './arrow.css'

export default function (props) {

    return (
        <p style={{borderColor: props.color}} className={`arrow ${props.direction}`}></p>
    )
}