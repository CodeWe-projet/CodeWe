function temporaryCardAlert(title, message, type, duration){
    const id = getRandomString(11);
    const card = document.createElement('div');
    card.classList.add('alertCard');
    card.id = id;
    card.innerHTML = "<h3>" + title + "</h3><p>" + message + "</p>";
    document.getElementById('body').appendChild(card);

    setTimeout(() => {
        card.remove();
    }, duration);
}