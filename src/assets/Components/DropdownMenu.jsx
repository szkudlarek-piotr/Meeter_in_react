export default function DropdownMenu({widthValue, placeholder, requestAdress}) {
    return (
        <div style={ width: {{widthValue}}}>
            <input type="text" placeholder={placeholder} />
        </div>
    )
}