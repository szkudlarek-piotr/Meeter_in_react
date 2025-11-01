export default function CaptionedPhoto({divWidth, photoWidth, borderRadius, photoBorderWidthInPx, photoCaption, captionWidth, photoAdress, ...props }) {

    const divWidthAsProc = `${divWidth}%`
    const photoWidthAsProc = `${photoWidth}%`
    const photoMarginsAsPercent = (100 - parseFloat(photoWidth)) / 2
    const photoMargin = `calc(${photoMarginsAsPercent}% - ${photoBorderWidthInPx}px)`


    const borderRadiusAsPx = `${borderRadius}px`
    const captionWidthAsProc = `${captionWidth}%`
    const captionMargin = (100 - parseFloat(captionWidth)) / 2
    const captionMarginAsText = `${captionMargin}%`
    const photoBorderStyle = `${photoBorderWidthInPx}px solid black`


    return (<div style={{ width: divWidthAsProc}}>
        <img src={photoAdress} style={{ width:photoWidthAsProc, border:photoBorderStyle ,marginLeft: photoMargin, marginRight: photoMargin, borderRadius: borderRadiusAsPx, aspectRatio: 1/1 }} />
        <h3 style={{ fontFamily: "Comic Sans MS", width: captionWidthAsProc, marginLeft: captionMarginAsText, marginRight: captionMarginAsText, fontSize: "20px"}}>{photoCaption}</h3>
        {props.hiddenInputId && <input type="hidden" value="0" id={props.hiddenInputId} />}
    </div>)

}