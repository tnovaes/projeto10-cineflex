export default function MovieBanner({url, title}){
    return(
        <>
        <img src={url} alt={title}></img>
        </>
    );
}