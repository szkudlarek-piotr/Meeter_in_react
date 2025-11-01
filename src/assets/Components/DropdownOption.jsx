
export default function DropdownOptionForHuman({photo, name, id}) {
    return (
        <div onDoubleClick={}>
            <img src={photo} alt={name}/>
            <div className="humanName">{name}</div>
        </div>)
}