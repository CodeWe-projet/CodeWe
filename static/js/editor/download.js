export function download(element, link_id){
    const link = document.getElementById(link_id);
    link.addEventListener('click', e => {
        const content = element.innerText.replaceAll('\n\n', '\n');
        link.setAttribute(
            'href',
            'data:Content-type, ' + escape(content)
        )
    });
}